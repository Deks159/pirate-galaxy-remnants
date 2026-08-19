const catalog = {
  "Tormenta": {
    "Misiles": ["Potente", "Rápido"],
    "Mira Computarizada": ["Potente", "Duradera"],
    "Perforador": ["Duradera"],
    "Rayo Térmico": ["Potente", "Duradero"]
  },
  "Tanque": {
    "Escudo": ["Duradero", "Rápido"],
    "Picador": ["Potente", "Duradero"],
    "Señal de interferencia": ["Duradera", "Potente"],
    "Bomba de agresión": ["Potente", "Rápida"]
  },
  "Ingeniero": {
    "Protector": ["Duradero", "Rápido"],
    "Telereparador": ["Duradero", "Potente"],
    "Campo de reparación": ["Duradero", "Potente"],
    "Resurrector": ["Duradero", "Potente"]
  },
  "Shock": {
    "Acelerador": ["Duradero", "Potente"],
    "Desacelerador": ["Duradero", "Potente"],
    "Señuelo": ["Duradero", "Potente"],
    "Paralizador": ["Duradero", "Potente"]
  },
  "Sniper": {
    "Largo Alcance": ["Potente", "Rápido"],
    "Droide de ataque": ["Potente", "Duradero"],
    "Ataque Orbital": ["Potente", "Rápido"],
    "Carga de Ataque": ["Potente", "Duradero"]
  },
  "Defensor": {
    "Torre de ataque": ["Duradero", "Potente"],
    "Torre de Reparación": ["Duradero", "Potente"],
    "Mina": ["Duradera", "Rápida"],
    "Bomba Lapa": ["Rápida", "Potente"]
  },
  "Luchador": {
    "Inversor de Daño": ["Duradero", "Potente"],
    "Droide Deflector": ["Duradero", "Potente"],
    "Salto Cuántico": ["Rápido", "Potente"],
    "Haz Eléctrico": ["Rápido", "Potente"]
  },
  "Soporte": {
    "Aura Protectora": ["Potente", "Duradero"],
    "Absorbedor de Alcance": ["Potente", "Duradero"],
    "Trampa Magnética": ["Potente", "Duradera"],
    "Nube Corrosiva": ["Potente", "Duradera"]
  },
  "Comunes": {
    "Cañón": ["Potente", "Rápido"],
    "Recolector": [],
    "Reparador": ["Potente", "Duradero"],
    "Impulsor": ["Potente", "Duradero"]
  }
};

const cfg = window.REMNANT_CONFIG || {};
const configured = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY &&
  !cfg.SUPABASE_URL.includes("TU-PROYECTO") && !cfg.SUPABASE_ANON_KEY.includes("TU-");
const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

const $ = selector => document.querySelector(selector);
const els = {
  spainClock: $("#spainClock"),
  remnantTypeGroup: $("#remnantTypeGroup"),
  classSelect: $("#classSelect"),
  blueprintSelect: $("#blueprintSelect"),
  technologyGroup: $("#technologyGroup"),
  dynamicFields: $("#dynamicFields"),
  evidenceInput: $("#evidenceInput"),
  uploadBox: document.querySelector(".upload-box"),
  uploadPlaceholder: $("#uploadPlaceholder"),
  imagePreviewWrap: $("#imagePreviewWrap"),
  imagePreview: $("#imagePreview"),
  removeEvidenceBtn: $("#removeEvidenceBtn"),
  existingEvidenceBox: $("#existingEvidenceBox"),
  viewExistingEvidenceBtn: $("#viewExistingEvidenceBtn"),
  removeExistingEvidence: $("#removeExistingEvidence"),
  saveBtn: $("#saveBtn"),
  cancelEditBtn: $("#cancelEditBtn"),
  feedback: $("#formFeedback"),
  recentList: $("#recentList"),
  recentCount: $("#recentCount"),
  historyBody: $("#historyBody"),
  emptyHistory: $("#emptyHistory"),
  searchInput: $("#searchInput"),
  filterType: $("#filterType"),
  filterClass: $("#filterClass"),
  filterTechnology: $("#filterTechnology"),
  pageSizeSelect: $("#pageSizeSelect"),
  prevPageBtn: $("#prevPageBtn"),
  nextPageBtn: $("#nextPageBtn"),
  pageRange: $("#pageRange"),
  pageIndicator: $("#pageIndicator"),
  exportBtn: $("#exportBtn"),
  metricToday: $("#metricToday"),
  metricXC: $("#metricXC"),
  metricSC: $("#metricSC"),
  metricTotal: $("#metricTotal"),
  evidenceDialog: $("#evidenceDialog"),
  dialogTitle: $("#dialogTitle"),
  dialogImage: $("#dialogImage"),
  closeDialogBtn: $("#closeDialogBtn"),
  adminLoginBtn: $("#adminLoginBtn"),
  adminDialog: $("#adminDialog"),
  adminLoginForm: $("#adminLoginForm"),
  adminEmail: $("#adminEmail"),
  adminPassword: $("#adminPassword"),
  adminLoginFeedback: $("#adminLoginFeedback"),
  closeAdminDialogBtn: $("#closeAdminDialogBtn"),
  adminBanner: $("#adminBanner"),
  adminIdentity: $("#adminIdentity"),
  manageFieldsBtn: $("#manageFieldsBtn"),
  fieldsDialog: $("#fieldsDialog"),
  closeFieldsDialogBtn: $("#closeFieldsDialogBtn"),
  fieldsList: $("#fieldsList"),
  fieldEditorForm: $("#fieldEditorForm"),
  fieldId: $("#fieldId"),
  fieldLabel: $("#fieldLabel"),
  fieldType: $("#fieldType"),
  fieldOptionsWrap: $("#fieldOptionsWrap"),
  fieldOptions: $("#fieldOptions"),
  fieldRequired: $("#fieldRequired"),
  fieldActive: $("#fieldActive"),
  fieldSortOrder: $("#fieldSortOrder"),
  cancelFieldEditBtn: $("#cancelFieldEditBtn"),
  fieldEditorTitle: $("#fieldEditorTitle"),
  fieldFeedback: $("#fieldFeedback"),
  entryEyebrow: $("#entryEyebrow"),
  entryTitle: $("#entryTitle"),
  entryBadge: $("#entryBadge")
};

let selectedType = "XC";
let selectedTechnology = "Normal";
let evidenceBlob = null;
let evidencePreviewUrl = null;
let records = [];
let recentRecords = [];
let formFields = [];
let currentUser = null;
let editingRecordId = null;
let editingOriginalEvidencePath = null;
let currentPage = 1;
let pageSize = 20;
let historyTotal = 0;
let metrics = { today: 0, xc: 0, sc: 0, total: 0 };
let searchDebounceTimer = null;

function isSuperAdmin(user = currentUser) {
  return user?.app_metadata?.role === "super_admin";
}

function spainParts(date = new Date()) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("es-ES", {
      timeZone: "Europe/Madrid",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).formatToParts(date).map(p => [p.type, p.value])
  );
}

function spainDateTime(value) {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    dateStyle: "medium",
    timeStyle: "medium"
  }).format(new Date(value));
}

function spainTime(value) {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(value));
}

function spainDateKey(value = new Date()) {
  const p = spainParts(new Date(value));
  return `${p.year}-${p.month}-${p.day}`;
}

function timeZoneOffsetMs(date, timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date).map(p => [p.type, p.value])
  );

  const representedAsUtc = Date.UTC(
    Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(parts.hour), Number(parts.minute), Number(parts.second)
  );

  return representedAsUtc - date.getTime();
}

function zonedLocalMidnightToUtc(year, month, day, timeZone = "Europe/Madrid") {
  const targetUtc = Date.UTC(year, month - 1, day, 0, 0, 0);
  let guess = targetUtc;

  for (let i = 0; i < 3; i += 1) {
    const offset = timeZoneOffsetMs(new Date(guess), timeZone);
    const adjusted = targetUtc - offset;
    if (Math.abs(adjusted - guess) < 1000) return new Date(adjusted);
    guess = adjusted;
  }

  return new Date(guess);
}

function spainTodayUtcRange() {
  const p = spainParts();
  const year = Number(p.year);
  const month = Number(p.month);
  const day = Number(p.day);

  const start = zonedLocalMidnightToUtc(year, month, day);
  const nextLocalDate = new Date(Date.UTC(year, month - 1, day + 1));
  const end = zonedLocalMidnightToUtc(
    nextLocalDate.getUTCFullYear(),
    nextLocalDate.getUTCMonth() + 1,
    nextLocalDate.getUTCDate()
  );

  return { start: start.toISOString(), end: end.toISOString() };
}

function updateClock() {
  const p = spainParts();
  els.spainClock.textContent = `${p.hour}:${p.minute}:${p.second}`;
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[c]);
}

function slugify(value) {
  return value
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/^[^a-z]+/, "field_");
}

function availableTechnologies() {
  const specific = catalog[els.classSelect.value][els.blueprintSelect.value] || [];
  return [...new Set(["Normal", ...specific])];
}

function populateClasses() {
  Object.keys(catalog).forEach(name => {
    els.classSelect.add(new Option(name, name));
    els.filterClass.add(new Option(name, name));
  });
  populateBlueprints();
}

function populateBlueprints() {
  const cls = els.classSelect.value;
  els.blueprintSelect.innerHTML = "";
  Object.keys(catalog[cls]).forEach(name => els.blueprintSelect.add(new Option(name, name)));
  populateTechnologies();
}

function populateTechnologies(preferred = null) {
  const technologies = availableTechnologies();
  selectedTechnology = technologies.includes(preferred) ? preferred : technologies[0];
  els.technologyGroup.innerHTML = "";

  technologies.forEach(technology => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tech-btn${technology === selectedTechnology ? " active" : ""}`;
    btn.dataset.value = technology;
    btn.textContent = technology;
    btn.addEventListener("click", () => {
      selectedTechnology = technology;
      els.technologyGroup.querySelectorAll(".tech-btn")
        .forEach(x => x.classList.toggle("active", x === btn));
    });
    els.technologyGroup.appendChild(btn);
  });
}

function setSelectedType(value) {
  selectedType = value;
  els.remnantTypeGroup.querySelectorAll(".segment")
    .forEach(btn => btn.classList.toggle("active", btn.dataset.value === value));
}

function renderDynamicFields(values = {}) {
  els.dynamicFields.innerHTML = "";
  const activeFields = formFields.filter(f => f.active);

  activeFields.forEach(field => {
    const wrap = document.createElement("div");
    wrap.className = "field-group dynamic-field";
    wrap.dataset.fieldKey = field.field_key;

    const label = document.createElement("label");
    label.textContent = field.label + (field.required ? " *" : "");
    wrap.appendChild(label);

    let input;
    const current = values?.[field.field_key];

    if (field.field_type === "textarea") {
      input = document.createElement("textarea");
      input.value = current ?? "";
    } else if (field.field_type === "select") {
      input = document.createElement("select");
      input.add(new Option("Seleccionar…", ""));
      (Array.isArray(field.options) ? field.options : []).forEach(option => input.add(new Option(option, option)));
      input.value = current ?? "";
    } else if (field.field_type === "checkbox") {
      const checkboxWrap = document.createElement("label");
      checkboxWrap.className = "checkbox-field";
      input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(current);
      checkboxWrap.appendChild(input);
      checkboxWrap.appendChild(document.createTextNode(" Sí"));
      wrap.appendChild(checkboxWrap);
    } else {
      input = document.createElement("input");
      input.type = field.field_type === "number" ? "number" : "text";
      input.value = current ?? "";
      wrap.appendChild(input);
    }

    input.dataset.dynamicKey = field.field_key;
    input.dataset.fieldType = field.field_type;
    if (field.required) input.required = true;

    if (field.field_type !== "checkbox" && !wrap.contains(input)) wrap.appendChild(input);
    els.dynamicFields.appendChild(wrap);
  });
}

function collectExtraData() {
  const data = {};

  for (const field of formFields.filter(f => f.active)) {
    const input = els.dynamicFields.querySelector(`[data-dynamic-key="${CSS.escape(field.field_key)}"]`);
    if (!input) continue;

    let value;
    if (field.field_type === "checkbox") value = input.checked;
    else if (field.field_type === "number") value = input.value === "" ? null : Number(input.value);
    else value = input.value.trim();

    if (field.required && (value === "" || value === null || value === false)) {
      throw new Error(`Completa el campo obligatorio: ${field.label}.`);
    }

    if (value !== "" && value !== null && value !== false) data[field.field_key] = value;
    if (field.field_type === "checkbox") data[field.field_key] = value;
  }

  return data;
}

function setEvidencePreview(blob) {
  if (evidencePreviewUrl) URL.revokeObjectURL(evidencePreviewUrl);
  evidencePreviewUrl = blob ? URL.createObjectURL(blob) : null;
  evidenceBlob = blob;
  els.imagePreviewWrap.classList.toggle("hidden", !blob);
  els.uploadPlaceholder.classList.toggle("hidden", !!blob);
  if (blob) els.imagePreview.src = evidencePreviewUrl;
  else els.imagePreview.removeAttribute("src");
}

async function compressImage(file, maxSide = 1600, quality = 0.82) {
  if (!file.type.startsWith("image/")) throw new Error("Selecciona una imagen.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return await new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error("No se pudo procesar la imagen.")),
      "image/webp",
      quality
    );
  });
}

async function ensureSession() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    currentUser = session.user;
    return;
  }

  const { data, error } = await sb.auth.signInAnonymously();
  if (error) throw error;
  currentUser = data.user;
}

async function refreshCurrentUser() {
  const { data: { user }, error } = await sb.auth.getUser();
  if (error) throw error;
  currentUser = user;
  applyAdminUi();
}

async function loadFormFields() {
  const { data, error } = await sb
    .from("form_fields")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  formFields = data || [];
  renderDynamicFields(editingRecordId ? records.find(r => r.id === editingRecordId)?.extra_data || {} : {});
  renderFieldsManager();
}

function sanitizePostgrestSearch(value) {
  return value
    .replace(/[,*()%]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function applyHistoryFilters(query) {
  if (els.filterType.value) query = query.eq("remnant_type", els.filterType.value);
  if (els.filterClass.value) query = query.eq("class_name", els.filterClass.value);
  if (els.filterTechnology.value) query = query.eq("technology", els.filterTechnology.value);

  const term = sanitizePostgrestSearch(els.searchInput.value);
  if (term) {
    const searchableDynamicFields = formFields.filter(field =>
      field.active && ["text", "textarea", "select"].includes(field.field_type)
    );

    const conditions = [
      `remnant_type.ilike.*${term}*`,
      `class_name.ilike.*${term}*`,
      `blueprint.ilike.*${term}*`,
      `technology.ilike.*${term}*`,
      ...searchableDynamicFields.map(field =>
        `extra_data->>${field.field_key}.ilike.*${term}*`
      )
    ];

    query = query.or(conditions.join(","));
  }

  return query;
}

async function loadHistoryPage() {
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = sb
    .from("remnant_records")
    .select("*", { count: "exact" });

  query = applyHistoryFilters(query)
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data, count, error } = await query;
  if (error) throw error;

  historyTotal = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(historyTotal / pageSize));

  if (currentPage > totalPages) {
    currentPage = totalPages;
    return loadHistoryPage();
  }

  records = data || [];
}

async function loadRecentRecords() {
  const { data, error } = await sb
    .from("remnant_records")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) throw error;
  recentRecords = data || [];
}

async function countRecords(configureQuery = query => query) {
  let query = sb
    .from("remnant_records")
    .select("id", { count: "exact", head: true });

  query = configureQuery(query);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

async function loadMetrics() {
  const { start, end } = spainTodayUtcRange();

  const [total, xc, sc, today] = await Promise.all([
    countRecords(),
    countRecords(query => query.eq("remnant_type", "XC")),
    countRecords(query => query.eq("remnant_type", "SC")),
    countRecords(query => query.gte("created_at", start).lt("created_at", end))
  ]);

  metrics = { total, xc, sc, today };
}

async function refreshDashboardData() {
  await Promise.all([
    loadHistoryPage(),
    loadRecentRecords(),
    loadMetrics()
  ]);
  renderAll();
}

async function refreshHistory() {
  await loadHistoryPage();
  renderHistory();
  renderPagination();
}

function renderMetrics() {
  els.metricToday.textContent = metrics.today;
  els.metricXC.textContent = metrics.xc;
  els.metricSC.textContent = metrics.sc;
  els.metricTotal.textContent = metrics.total;
}

function extraDataHtml(record) {
  const entries = Object.entries(record.extra_data || {});
  if (!entries.length) return '<span class="no-evidence">—</span>';

  return entries.map(([key, value]) => {
    const field = formFields.find(f => f.field_key === key);
    const label = field?.label || key;
    const shown = typeof value === "boolean" ? (value ? "Sí" : "No") : value;
    return `<span class="extra-chip"><strong>${esc(label)}:</strong> ${esc(shown)}</span>`;
  }).join("");
}

function renderRecent() {
  const latest = recentRecords;
  const visible = latest.length;
  els.recentCount.textContent = visible === 1 ? "1 reciente" : `${visible} recientes`;

  if (!latest.length) {
    els.recentList.innerHTML = '<div class="recent-empty">Aún no hay remanentes registrados.</div>';
    return;
  }

  els.recentList.innerHTML = latest.map(record => {
    const pilot = record.extra_data?.pilot_name ? ` · ${esc(record.extra_data.pilot_name)}` : "";
    return `<div class="recent-item">
      <div class="type-pill">${record.remnant_type}</div>
      <div class="recent-copy">
        <strong>${esc(record.blueprint)} · ${esc(record.technology)}</strong>
        <small>${esc(record.class_name)}${pilot}${record.evidence_path ? " · 📷 evidencia" : ""}</small>
      </div>
      <div class="recent-time">${spainTime(record.created_at)}</div>
    </div>`;
  }).join("");
}

function renderHistory() {
  const rows = records;
  els.historyBody.innerHTML = "";
  els.emptyHistory.classList.toggle("hidden", rows.length > 0);

  rows.forEach(record => {
    const tr = document.createElement("tr");
    const adminActions = isSuperAdmin()
      ? `<td class="admin-col">
          <div class="record-actions">
            <button type="button" class="mini-btn edit-record-btn" data-id="${record.id}">Editar</button>
            <button type="button" class="mini-btn danger delete-record-btn" data-id="${record.id}">Eliminar</button>
          </div>
        </td>`
      : `<td class="admin-col hidden"></td>`;

    tr.innerHTML = `
      <td>${spainDateTime(record.created_at)}</td>
      <td><strong>${record.remnant_type}</strong></td>
      <td>${esc(record.class_name)}</td>
      <td>${esc(record.blueprint)}</td>
      <td>${esc(record.technology)}</td>
      <td>${extraDataHtml(record)}</td>
      <td>${record.evidence_path
        ? `<button type="button" class="evidence-btn" data-id="${record.id}">Ver foto</button>`
        : '<span class="no-evidence">Sin foto</span>'}</td>
      ${adminActions}
    `;

    els.historyBody.appendChild(tr);
  });

  els.historyBody.querySelectorAll(".evidence-btn")
    .forEach(btn => btn.addEventListener("click", () => openEvidence(btn.dataset.id)));

  els.historyBody.querySelectorAll(".edit-record-btn")
    .forEach(btn => btn.addEventListener("click", () => beginEditRecord(btn.dataset.id)));

  els.historyBody.querySelectorAll(".delete-record-btn")
    .forEach(btn => btn.addEventListener("click", () => deleteRecord(btn.dataset.id)));
}

function renderPagination() {
  const totalPages = Math.max(1, Math.ceil(historyTotal / pageSize));
  const first = historyTotal === 0 ? 0 : ((currentPage - 1) * pageSize) + 1;
  const last = historyTotal === 0 ? 0 : Math.min(currentPage * pageSize, historyTotal);

  els.pageRange.textContent = `${first}–${last} de ${historyTotal}`;
  els.pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
  els.prevPageBtn.disabled = currentPage <= 1;
  els.nextPageBtn.disabled = currentPage >= totalPages;
  els.pageSizeSelect.value = String(pageSize);
}

function renderAll() {
  renderMetrics();
  renderRecent();
  renderHistory();
  renderPagination();
}

function applyAdminUi() {
  const admin = isSuperAdmin();
  document.body.classList.toggle("is-admin", admin);
  els.adminBanner.classList.toggle("hidden", !admin);
  els.manageFieldsBtn.classList.toggle("hidden", !admin);
  els.exportBtn.classList.toggle("hidden", !admin);

  if (admin) {
    els.adminIdentity.textContent = currentUser.email || "Superusuario";
    els.adminLoginBtn.textContent = "Salir admin";
    els.entryBadge.textContent = editingRecordId ? "Edición admin" : "Alta manual admin";
  } else {
    els.adminLoginBtn.textContent = "Admin";
    els.entryBadge.textContent = "Data entry";
  }

  renderHistory();
}

async function saveCurrentRecord() {
  if (!configured) {
    els.feedback.textContent = "Configura Supabase en config.js antes de registrar.";
    return;
  }

  els.saveBtn.disabled = true;
  els.feedback.textContent = editingRecordId ? "Guardando cambios…" : "Guardando en Supabase…";

  let newEvidencePath = null;

  try {
    const extraData = collectExtraData();

    if (evidenceBlob) {
      newEvidencePath = `${currentUser.id}/${crypto.randomUUID()}.webp`;
      const { error: uploadError } = await sb.storage
        .from("remnant-evidence")
        .upload(newEvidencePath, evidenceBlob, { contentType: "image/webp", upsert: false });

      if (uploadError) throw uploadError;
    }

    if (editingRecordId) {
      if (!isSuperAdmin()) throw new Error("La sesión ya no tiene permisos de superusuario.");

      const currentRecord = records.find(r => r.id === editingRecordId);
      let finalEvidencePath = currentRecord?.evidence_path || null;

      if (newEvidencePath) finalEvidencePath = newEvidencePath;
      else if (els.removeExistingEvidence.checked) finalEvidencePath = null;

      const payload = {
        remnant_type: selectedType,
        class_name: els.classSelect.value,
        blueprint: els.blueprintSelect.value,
        technology: selectedTechnology,
        extra_data: extraData,
        evidence_path: finalEvidencePath,
        updated_at: new Date().toISOString(),
        updated_by: currentUser.id
      };

      const { data, error } = await sb
        .from("remnant_records")
        .update(payload)
        .eq("id", editingRecordId)
        .select()
        .single();

      if (error) {
        if (newEvidencePath) await sb.storage.from("remnant-evidence").remove([newEvidencePath]);
        throw error;
      }

      const oldEvidence = currentRecord?.evidence_path;
      const shouldDeleteOld = oldEvidence && (newEvidencePath || els.removeExistingEvidence.checked);
      if (shouldDeleteOld) {
        const { error: deleteEvidenceError } = await sb.storage.from("remnant-evidence").remove([oldEvidence]);
        if (deleteEvidenceError) console.warn("Registro actualizado, pero no se pudo limpiar la evidencia anterior.", deleteEvidenceError);
      }

      cancelEditMode(false);
      await refreshDashboardData();
      els.feedback.textContent = `✓ Registro actualizado: ${data.remnant_type} · ${data.blueprint} · ${data.technology}.`;
    } else {
      const payload = {
        remnant_type: selectedType,
        class_name: els.classSelect.value,
        blueprint: els.blueprintSelect.value,
        technology: selectedTechnology,
        extra_data: extraData,
        evidence_path: newEvidencePath
      };

      const { data, error } = await sb
        .from("remnant_records")
        .insert(payload)
        .select()
        .single();

      if (error) {
        if (newEvidencePath) await sb.storage.from("remnant-evidence").remove([newEvidencePath]);
        throw error;
      }

      currentPage = 1;
      resetEntryForm();
      await refreshDashboardData();
      els.feedback.textContent = `✓ ${data.remnant_type} · ${data.blueprint} · ${data.technology} registrado a las ${spainTime(data.created_at)} (hora España).`;
    }
  } catch (error) {
    els.feedback.textContent = `No se pudo guardar: ${error.message}`;
  } finally {
    els.saveBtn.disabled = false;
  }
}

function resetEntryForm() {
  setEvidencePreview(null);
  els.evidenceInput.value = "";
  els.removeExistingEvidence.checked = false;
  els.existingEvidenceBox.classList.add("hidden");
  renderDynamicFields({});
}

function beginEditRecord(id) {
  if (!isSuperAdmin()) return;

  const record = records.find(r => String(r.id) === String(id));
  if (!record) return;

  editingRecordId = record.id;
  editingOriginalEvidencePath = record.evidence_path || null;

  setSelectedType(record.remnant_type);
  els.classSelect.value = record.class_name;
  populateBlueprints();
  els.blueprintSelect.value = record.blueprint;
  populateTechnologies(record.technology);
  renderDynamicFields(record.extra_data || {});

  setEvidencePreview(null);
  els.evidenceInput.value = "";
  els.removeExistingEvidence.checked = false;
  els.existingEvidenceBox.classList.toggle("hidden", !editingOriginalEvidencePath);

  els.entryEyebrow.textContent = "EDITAR REGISTRO";
  els.entryTitle.textContent = `${record.remnant_type} · ${record.blueprint}`;
  els.entryBadge.textContent = "Edición admin";
  els.saveBtn.querySelector("span").textContent = "Guardar cambios";
  els.cancelEditBtn.classList.remove("hidden");

  document.querySelector(".entry-panel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelEditMode(clearFeedback = true) {
  editingRecordId = null;
  editingOriginalEvidencePath = null;
  els.entryEyebrow.textContent = "NUEVO REGISTRO";
  els.entryTitle.textContent = "Registrar remanente";
  els.entryBadge.textContent = isSuperAdmin() ? "Alta manual admin" : "Data entry";
  els.saveBtn.querySelector("span").textContent = "Registrar remanente";
  els.cancelEditBtn.classList.add("hidden");
  resetEntryForm();
  if (clearFeedback) els.feedback.textContent = "";
}

async function deleteRecord(id) {
  if (!isSuperAdmin()) return;

  const record = records.find(r => String(r.id) === String(id));
  if (!record) return;

  if (!confirm(`Eliminar definitivamente ${record.remnant_type} · ${record.blueprint} · ${record.technology}?`)) return;

  els.feedback.textContent = "Eliminando registro…";

  try {
    if (record.evidence_path) {
      const { error: storageError } = await sb.storage
        .from("remnant-evidence")
        .remove([record.evidence_path]);
      if (storageError) throw new Error(`No se pudo eliminar la evidencia: ${storageError.message}`);
    }

    const { error } = await sb
      .from("remnant_records")
      .delete()
      .eq("id", record.id);

    if (error) throw error;

    if (editingRecordId === record.id) cancelEditMode(false);
    await refreshDashboardData();
    els.feedback.textContent = "✓ Registro eliminado.";
  } catch (error) {
    els.feedback.textContent = `No se pudo eliminar: ${error.message}`;
  }
}

async function openEvidence(idOrRecord) {
  const record = typeof idOrRecord === "object"
    ? idOrRecord
    : records.find(r => String(r.id) === String(idOrRecord));

  if (!record?.evidence_path) return;

  const { data, error } = await sb.storage
    .from("remnant-evidence")
    .createSignedUrl(record.evidence_path, 60);

  if (error) {
    els.feedback.textContent = `No se pudo abrir evidencia: ${error.message}`;
    return;
  }

  els.dialogTitle.textContent = `${record.remnant_type} · ${record.blueprint} · ${record.technology}`;
  els.dialogImage.src = data.signedUrl;
  els.evidenceDialog.showModal();
}

async function adminLogin(event) {
  event.preventDefault();
  els.adminLoginFeedback.textContent = "Verificando…";

  const email = els.adminEmail.value.trim();
  const password = els.adminPassword.value;

  try {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const user = data.user;
    if (user?.app_metadata?.role !== "super_admin") {
      await sb.auth.signOut();
      await ensureSession();
      throw new Error("La cuenta es válida, pero no tiene rol de superusuario.");
    }

    currentUser = user;
    els.adminPassword.value = "";
    els.adminLoginFeedback.textContent = "";
    els.adminDialog.close();

    await loadFormFields();
    await refreshDashboardData();
    applyAdminUi();
    els.feedback.textContent = "✓ Modo superusuario activo.";
  } catch (error) {
    els.adminLoginFeedback.textContent = error.message;
  }
}

async function adminLogout() {
  await sb.auth.signOut();
  currentUser = null;
  editingRecordId = null;
  await ensureSession();
  await loadFormFields();
  await refreshDashboardData();
  applyAdminUi();
  els.feedback.textContent = "Sesión administrativa cerrada.";
}

function renderFieldsManager() {
  if (!els.fieldsList) return;

  if (!isSuperAdmin()) {
    els.fieldsList.innerHTML = "";
    return;
  }

  if (!formFields.length) {
    els.fieldsList.innerHTML = '<div class="recent-empty">No hay campos dinámicos.</div>';
    return;
  }

  els.fieldsList.innerHTML = formFields.map(field => `
    <div class="field-row">
      <div>
        <strong>${esc(field.label)}</strong>
        <small>${esc(field.field_key)} · ${esc(field.field_type)} · ${field.active ? "Activo" : "Inactivo"}${field.required ? " · Obligatorio" : ""}</small>
      </div>
      <div class="row-actions">
        <button type="button" class="mini-btn edit-field-btn" data-id="${field.id}">Editar</button>
        <button type="button" class="mini-btn ${field.active ? "" : "danger"} toggle-field-btn" data-id="${field.id}">
          ${field.active ? "Desactivar" : "Activar"}
        </button>
        <button type="button" class="mini-btn danger delete-field-btn" data-id="${field.id}">Eliminar</button>
      </div>
    </div>
  `).join("");

  els.fieldsList.querySelectorAll(".edit-field-btn")
    .forEach(btn => btn.addEventListener("click", () => editField(btn.dataset.id)));

  els.fieldsList.querySelectorAll(".toggle-field-btn")
    .forEach(btn => btn.addEventListener("click", () => toggleField(btn.dataset.id)));

  els.fieldsList.querySelectorAll(".delete-field-btn")
    .forEach(btn => btn.addEventListener("click", () => deleteField(btn.dataset.id)));
}

function resetFieldEditor() {
  els.fieldId.value = "";
  els.fieldLabel.value = "";
  els.fieldType.value = "text";
  els.fieldOptions.value = "";
  els.fieldRequired.checked = false;
  els.fieldActive.checked = true;
  els.fieldSortOrder.value = "100";
  els.fieldOptionsWrap.classList.add("hidden");
  els.fieldEditorTitle.textContent = "Agregar campo";
  els.cancelFieldEditBtn.classList.add("hidden");
  els.fieldFeedback.textContent = "";
}

function editField(id) {
  const field = formFields.find(f => String(f.id) === String(id));
  if (!field) return;

  els.fieldId.value = field.id;
  els.fieldLabel.value = field.label;
  els.fieldType.value = field.field_type;
  els.fieldOptions.value = (field.options || []).join(", ");
  els.fieldRequired.checked = field.required;
  els.fieldActive.checked = field.active;
  els.fieldSortOrder.value = field.sort_order;
  els.fieldOptionsWrap.classList.toggle("hidden", field.field_type !== "select");
  els.fieldEditorTitle.textContent = "Editar campo";
  els.cancelFieldEditBtn.classList.remove("hidden");
}

async function saveField(event) {
  event.preventDefault();
  if (!isSuperAdmin()) return;

  const id = els.fieldId.value;
  const label = els.fieldLabel.value.trim();
  if (!label) return;

  const type = els.fieldType.value;
  const options = type === "select"
    ? els.fieldOptions.value.split(",").map(x => x.trim()).filter(Boolean)
    : [];

  const payload = {
    label,
    field_type: type,
    required: els.fieldRequired.checked,
    active: els.fieldActive.checked,
    sort_order: Number(els.fieldSortOrder.value || 100),
    options,
    updated_at: new Date().toISOString()
  };

  try {
    els.fieldFeedback.textContent = "Guardando…";

    if (id) {
      const { error } = await sb.from("form_fields").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      payload.field_key = slugify(label);
      const { error } = await sb.from("form_fields").insert(payload);
      if (error) throw error;
    }

    await loadFormFields();
    resetFieldEditor();
    els.fieldFeedback.textContent = "✓ Campo guardado.";
  } catch (error) {
    els.fieldFeedback.textContent = `No se pudo guardar: ${error.message}`;
  }
}

async function toggleField(id) {
  const field = formFields.find(f => String(f.id) === String(id));
  if (!field || !isSuperAdmin()) return;

  const { error } = await sb
    .from("form_fields")
    .update({ active: !field.active, updated_at: new Date().toISOString() })
    .eq("id", field.id);

  if (error) {
    els.fieldFeedback.textContent = error.message;
    return;
  }

  await loadFormFields();
}

async function deleteField(id) {
  const field = formFields.find(f => String(f.id) === String(id));
  if (!field || !isSuperAdmin()) return;

  const message = `Eliminar el campo "${field.label}" del formulario?\n\nLos valores históricos ya guardados en registros NO se borrarán.`;
  if (!confirm(message)) return;

  const { error } = await sb.from("form_fields").delete().eq("id", field.id);
  if (error) {
    els.fieldFeedback.textContent = error.message;
    return;
  }

  await loadFormFields();
  resetFieldEditor();
}

async function fetchAllFilteredRecords() {
  const allRows = [];
  const batchSize = 1000;
  let offset = 0;

  while (true) {
    let query = sb
      .from("remnant_records")
      .select("*");

    query = applyHistoryFilters(query)
      .order("created_at", { ascending: false })
      .range(offset, offset + batchSize - 1);

    const { data, error } = await query;
    if (error) throw error;

    const batch = data || [];
    allRows.push(...batch);

    if (batch.length < batchSize) break;
    offset += batchSize;
  }

  return allRows;
}

async function exportCsv() {
  if (!isSuperAdmin()) {
    els.feedback.textContent = "La exportación CSV está disponible únicamente para el superusuario.";
    return;
  }

  const originalText = els.exportBtn.textContent;
  els.exportBtn.disabled = true;
  els.exportBtn.textContent = "Exportando…";

  try {
    const rows = await fetchAllFilteredRecords();
    if (!rows.length) {
      els.feedback.textContent = "No hay registros para exportar con los filtros actuales.";
      return;
    }

    const dynamicKeys = [...new Set(rows.flatMap(r => Object.keys(r.extra_data || {})))];
    const header = [
      "fecha_hora_espana", "tipo_remanente", "clase", "plano", "tecnologia",
      ...dynamicKeys, "tiene_evidencia"
    ];

    const data = rows.map(record => [
      spainDateTime(record.created_at),
      record.remnant_type,
      record.class_name,
      record.blueprint,
      record.technology,
      ...dynamicKeys.map(key => record.extra_data?.[key] ?? ""),
      record.evidence_path ? "Sí" : "No"
    ]);

    const csv = [header, ...data]
      .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `remnant-log-${spainDateKey()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    els.feedback.textContent = `✓ CSV exportado con ${rows.length} registros filtrados.`;
  } catch (error) {
    els.feedback.textContent = `No se pudo exportar: ${error.message}`;
  } finally {
    els.exportBtn.disabled = false;
    els.exportBtn.textContent = originalText;
  }
}

els.remnantTypeGroup.querySelectorAll(".segment").forEach(btn => {
  btn.addEventListener("click", () => setSelectedType(btn.dataset.value));
});

els.classSelect.addEventListener("change", populateBlueprints);
els.blueprintSelect.addEventListener("change", () => populateTechnologies());


async function processEvidenceBlob(blob, sourceLabel = "captura") {
  try {
    if (!blob || !blob.type?.startsWith("image/")) {
      throw new Error("El contenido pegado no es una imagen.");
    }

    els.feedback.textContent = `Procesando ${sourceLabel}…`;
    const compressed = await compressImage(blob);
    setEvidencePreview(compressed);
    els.feedback.textContent = `✓ Evidencia pegada y lista (${Math.round(compressed.size / 1024)} KB).`;

    if (els.uploadBox) {
      els.uploadBox.classList.add("paste-flash");
      setTimeout(() => els.uploadBox.classList.remove("paste-flash"), 500);
    }
  } catch (error) {
    els.feedback.textContent = `No se pudo procesar la evidencia: ${error.message}`;
  }
}

document.addEventListener("paste", async event => {
  const items = Array.from(event.clipboardData?.items || []);
  const imageItem = items.find(item => item.type?.startsWith("image/"));

  // Si no hay imagen, dejamos que Ctrl+V funcione normalmente para texto.
  if (!imageItem) return;

  const imageFile = imageItem.getAsFile();
  if (!imageFile) return;

  event.preventDefault();
  await processEvidenceBlob(imageFile, "imagen del portapapeles");
});

document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") {
    els.uploadBox?.classList.add("paste-ready");
  }
});

document.addEventListener("keyup", event => {
  if (event.key.toLowerCase() === "v" || (!event.ctrlKey && !event.metaKey)) {
    els.uploadBox?.classList.remove("paste-ready");
  }
});

window.addEventListener("blur", () => els.uploadBox?.classList.remove("paste-ready"));

els.evidenceInput.addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;
  await processEvidenceBlob(file, "evidencia seleccionada");
});

els.removeEvidenceBtn.addEventListener("click", event => {
  event.preventDefault();
  event.stopPropagation();
  setEvidencePreview(null);
  els.evidenceInput.value = "";
});

els.viewExistingEvidenceBtn.addEventListener("click", () => {
  const record = records.find(r => r.id === editingRecordId);
  if (record) openEvidence(record);
});

els.saveBtn.addEventListener("click", saveCurrentRecord);
els.cancelEditBtn.addEventListener("click", () => cancelEditMode());

els.searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(async () => {
    currentPage = 1;
    try {
      await refreshHistory();
    } catch (error) {
      els.feedback.textContent = `No se pudo buscar: ${error.message}`;
    }
  }, 300);
});

[els.filterType, els.filterClass, els.filterTechnology].forEach(el => {
  el.addEventListener("change", async () => {
    currentPage = 1;
    try {
      await refreshHistory();
    } catch (error) {
      els.feedback.textContent = `No se pudo aplicar el filtro: ${error.message}`;
    }
  });
});

els.pageSizeSelect.addEventListener("change", async () => {
  pageSize = Number(els.pageSizeSelect.value) || 20;
  currentPage = 1;
  try {
    await refreshHistory();
  } catch (error) {
    els.feedback.textContent = `No se pudo cambiar el tamaño de página: ${error.message}`;
  }
});

els.prevPageBtn.addEventListener("click", async () => {
  if (currentPage <= 1) return;
  currentPage -= 1;
  try {
    await refreshHistory();
    document.querySelector(".history-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    currentPage += 1;
    els.feedback.textContent = `No se pudo cargar la página anterior: ${error.message}`;
  }
});

els.nextPageBtn.addEventListener("click", async () => {
  const totalPages = Math.max(1, Math.ceil(historyTotal / pageSize));
  if (currentPage >= totalPages) return;
  currentPage += 1;
  try {
    await refreshHistory();
    document.querySelector(".history-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    currentPage -= 1;
    els.feedback.textContent = `No se pudo cargar la página siguiente: ${error.message}`;
  }
});

els.exportBtn.addEventListener("click", exportCsv);
els.closeDialogBtn.addEventListener("click", () => els.evidenceDialog.close());

els.adminLoginBtn.addEventListener("click", async () => {
  if (isSuperAdmin()) {
    await adminLogout();
    return;
  }
  els.adminLoginFeedback.textContent = "";
  els.adminDialog.showModal();
});

els.closeAdminDialogBtn.addEventListener("click", () => els.adminDialog.close());
els.adminLoginForm.addEventListener("submit", adminLogin);

els.manageFieldsBtn.addEventListener("click", () => {
  if (!isSuperAdmin()) return;
  renderFieldsManager();
  els.fieldsDialog.showModal();
});

els.closeFieldsDialogBtn.addEventListener("click", () => els.fieldsDialog.close());
els.fieldEditorForm.addEventListener("submit", saveField);
els.cancelFieldEditBtn.addEventListener("click", resetFieldEditor);
els.fieldType.addEventListener("change", () => {
  els.fieldOptionsWrap.classList.toggle("hidden", els.fieldType.value !== "select");
});

(async function init() {
  populateClasses();
  updateClock();
  setInterval(updateClock, 1000);

  if (!configured) {
    els.feedback.textContent = "⚠ Falta configurar Supabase en config.js.";
    renderAll();
    return;
  }

  try {
    await ensureSession();
    await refreshCurrentUser();
    await loadFormFields();
    await refreshDashboardData();
    els.feedback.textContent = "✓ Conectado a Supabase. La hora la asigna PostgreSQL.";
  } catch (error) {
    els.feedback.textContent = `Error al conectar con Supabase: ${error.message}`;
  }
})();
