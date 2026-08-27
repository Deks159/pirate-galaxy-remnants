import { createClient } from "npm:@supabase/supabase-js@2.111.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function secretKey() {
  const modern = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (modern) {
    try {
      const parsed = JSON.parse(modern);
      if (parsed?.default) return parsed.default as string;
    } catch (_) {
      // fall through to legacy key
    }
  }
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!legacy) throw new Error("No server-side Supabase secret is configured.");
  return legacy;
}

function bearerToken(req: Request) {
  const header = req.headers.get("authorization") || "";
  return header.toLowerCase().startsWith("bearer ") ? header.slice(7) : "";
}

function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return (req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "").trim();
}

async function approximateGeo(ip: string) {
  if (!ip) return {};
  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(2200),
      headers: { "User-Agent": "PirateGalaxyRemnantLog/1.0" },
    });
    if (!response.ok) return {};
    const data = await response.json();
    if (!data?.success) return {};
    return {
      country_code: data.country_code || null,
      country_name: data.country || null,
      region_name: data.region || null,
      city: data.city || null,
      ip_timezone: data.timezone?.id || null,
    };
  } catch (_) {
    return {};
  }
}

function safeText(value: unknown, max = 300) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function generateTemporaryPassword() {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  const token = btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "A")
    .replaceAll("/", "b")
    .replaceAll("=", "");
  return `Pg!7${token}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const url = Deno.env.get("SUPABASE_URL");
    if (!url) throw new Error("SUPABASE_URL is not configured.");

    const admin = createClient(url, secretKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const token = bearerToken(req);
    if (!token) return json({ error: "Missing user token" }, 401);

    const { data: authData, error: authError } = await admin.auth.getUser(token);
    if (authError || !authData.user) return json({ error: "Invalid or expired session" }, 401);

    const caller = authData.user;
    const callerRole = caller.app_metadata?.role || "";
    const body = await req.json().catch(() => ({}));
    const action = safeText(body?.action, 50);

    const getMember = async (userId: string) => {
      const { data, error } = await admin
        .from("analysis_members")
        .select("user_id,email,display_name,status,created_at,updated_at")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    };

    const logViewerAccess = async (eventType: string, member: any | null) => {
      const ip = clientIp(req);
      const geo = await approximateGeo(ip);
      const allowedEvents = new Set(["login", "access_check", "analysis_open", "analysis_refresh", "access_denied"]);
      const normalizedEvent = allowedEvents.has(eventType) ? eventType : "access_check";

      const { error } = await admin.from("analysis_access_logs").insert({
        user_id: caller.id,
        email_snapshot: member?.email || caller.email || null,
        role_snapshot: callerRole || null,
        event_type: normalizedEvent,
        ip_address: ip || null,
        ...geo,
        user_agent: safeText(req.headers.get("user-agent"), 1000) || null,
        device_id: safeText(body?.device_id, 120) || null,
        browser_timezone: safeText(body?.browser_timezone, 120) || null,
        browser_language: safeText(body?.browser_language, 80) || null,
      });

      if (error) console.error("access log insert failed", error);
    };

    if (action === "check_access") {
      if (callerRole === "super_admin") {
        return json({ allowed: true, role: "super_admin", email: caller.email });
      }

      if (callerRole !== "analysis_viewer") {
        return json({ allowed: false, role: callerRole || null, reason: "role_not_allowed" }, 403);
      }

      const member = await getMember(caller.id);
      if (!member || member.status !== "active") {
        await logViewerAccess("access_denied", member);
        return json({
          allowed: false,
          role: "analysis_viewer",
          reason: member ? "banned" : "not_registered"
        }, 403);
      }

      await logViewerAccess(safeText(body?.event_type, 40) || "access_check", member);
      return json({
        allowed: true,
        role: "analysis_viewer",
        email: member.email,
        display_name: member.display_name,
        status: member.status,
      });
    }

    if (callerRole !== "super_admin") {
      return json({ error: "Only the super administrator can manage analysis accounts." }, 403);
    }

    if (action === "list_members") {
      const { data: members, error: memberError } = await admin
        .from("analysis_members")
        .select("user_id,email,display_name,status,created_at,updated_at")
        .order("created_at", { ascending: false });
      if (memberError) throw memberError;

      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: logs, error: logError } = await admin
        .from("analysis_access_logs")
        .select("user_id,event_type,ip_address,country_code,country_name,region_name,city,device_id,browser_timezone,created_at")
        .gte("created_at", cutoff)
        .order("created_at", { ascending: false })
        .limit(10000);
      if (logError) throw logError;

      const now = Date.now();
      const result = (members || []).map((member: any) => {
        const own = (logs || []).filter((row: any) => row.user_id === member.user_id);
        const last = own[0] || null;
        const in24h = own.filter((row: any) => now - new Date(row.created_at).getTime() <= 24 * 60 * 60 * 1000);
        const in7d = own.filter((row: any) => now - new Date(row.created_at).getTime() <= 7 * 24 * 60 * 60 * 1000);
        const uniq = (rows: any[], key: string) =>
          new Set(rows.map((row: any) => row[key]).filter(Boolean)).size;

        const countries24h = uniq(in24h, "country_code");
        const ips24h = uniq(in24h, "ip_address");
        const devices7d = uniq(in7d, "device_id");

        let risk = "low";
        if (countries24h >= 2 || devices7d >= 4 || ips24h >= 6) risk = "high";
        else if (devices7d >= 2 || ips24h >= 3) risk = "medium";

        return {
          ...member,
          last_access_at: last?.created_at || null,
          last_ip: last?.ip_address || null,
          last_location: last ? {
            city: last.city || null,
            region: last.region_name || null,
            country: last.country_name || null,
            country_code: last.country_code || null,
          } : null,
          ips_24h: ips24h,
          countries_24h: countries24h,
          devices_7d: devices7d,
          access_events_30d: own.length,
          sharing_risk: risk,
        };
      });

      return json({ members: result });
    }

    if (action === "member_logs") {
      const userId = safeText(body?.user_id, 80);
      if (!userId) return json({ error: "user_id is required" }, 400);

      const { data, error } = await admin
        .from("analysis_access_logs")
        .select("id,user_id,email_snapshot,event_type,ip_address,country_code,country_name,region_name,city,ip_timezone,user_agent,device_id,browser_timezone,browser_language,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return json({ logs: data || [] });
    }

    if (action === "create_member") {
      const email = safeText(body?.email, 320).toLowerCase();
      const displayName = safeText(body?.display_name, 120) || null;
      if (!email || !email.includes("@")) return json({ error: "A valid email is required." }, 400);

      const password = generateTemporaryPassword();
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role: "analysis_viewer" },
      });

      if (createError || !created.user) {
        return json({ error: createError?.message || "Could not create user." }, 400);
      }

      const { error: insertError } = await admin.from("analysis_members").insert({
        user_id: created.user.id,
        email,
        display_name: displayName,
        status: "active",
        created_by: caller.id,
      });

      if (insertError) {
        await admin.auth.admin.deleteUser(created.user.id).catch(() => null);
        throw insertError;
      }

      return json({
        member: {
          user_id: created.user.id,
          email,
          display_name: displayName,
          status: "active"
        },
        temporary_password: password,
      });
    }

    const targetId = safeText(body?.user_id, 80);
    if (["ban_member", "unban_member", "delete_member"].includes(action)) {
      if (!targetId) return json({ error: "user_id is required" }, 400);

      const { data: targetData, error: targetError } = await admin.auth.admin.getUserById(targetId);
      if (targetError || !targetData.user) return json({ error: "User not found." }, 404);

      if (targetData.user.app_metadata?.role === "super_admin") {
        return json({ error: "The super administrator cannot be modified from this panel." }, 403);
      }
      if (targetData.user.app_metadata?.role !== "analysis_viewer") {
        return json({ error: "This account is not an analysis viewer." }, 400);
      }
    }

    if (action === "ban_member") {
      const { error: dbError } = await admin
        .from("analysis_members")
        .update({ status: "banned", updated_at: new Date().toISOString() })
        .eq("user_id", targetId);
      if (dbError) throw dbError;

      const { error: authBanError } = await admin.auth.admin.updateUserById(targetId, {
        ban_duration: "876000h",
      });

      return json({ ok: true, auth_warning: authBanError?.message || null });
    }

    if (action === "unban_member") {
      const { error: authUnbanError } = await admin.auth.admin.updateUserById(targetId, {
        ban_duration: "none",
      });
      if (authUnbanError) return json({ error: authUnbanError.message }, 400);

      const { error: dbError } = await admin
        .from("analysis_members")
        .update({ status: "active", updated_at: new Date().toISOString() })
        .eq("user_id", targetId);
      if (dbError) throw dbError;

      return json({ ok: true });
    }

    if (action === "delete_member") {
      await admin
        .from("analysis_members")
        .update({ status: "banned", updated_at: new Date().toISOString() })
        .eq("user_id", targetId);

      const { error: deleteError } = await admin.auth.admin.deleteUser(targetId);
      if (deleteError) {
        return json({
          error: deleteError.message,
          detail: "The account remains blocked. If deletion fails because the user owns Storage objects, remove or reassign those objects first.",
        }, 400);
      }

      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
});
