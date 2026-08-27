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
  analysisBtn: $("#analysisBtn"),
  analysisDialog: $("#analysisDialog"),
  closeAnalysisDialogBtn: $("#closeAnalysisDialogBtn"),
  refreshAnalysisBtn: $("#refreshAnalysisBtn"),
  analysisUpdatedAt: $("#analysisUpdatedAt"),
  analysisLoading: $("#analysisLoading"),
  analysisFeedback: $("#analysisFeedback"),
  analysisSummaryMetrics: $("#analysisSummaryMetrics"),
  analysisCyclesBody: $("#analysisCyclesBody"),
  analysisFindings: $("#analysisFindings"),
  analysisSummaryTab: $("#analysisSummaryTab"),
  analysisCommonsTab: $("#analysisCommonsTab"),
  analysisQueryTab: $("#analysisQueryTab"),
  analysisCommonType: $("#analysisCommonType"),
  analysisCommonTarget: $("#analysisCommonTarget"),
  analysisCommonMetrics: $("#analysisCommonMetrics"),
  analysisTransitionTitle: $("#analysisTransitionTitle"),
  analysisTransitions: $("#analysisTransitions"),
  analysisOverdueList: $("#analysisOverdueList"),
  analysisCommonIntervalsBody: $("#analysisCommonIntervalsBody"),
  analysisQueryType: $("#analysisQueryType"),
  analysisQueryClass: $("#analysisQueryClass"),
  analysisQueryBlueprint: $("#analysisQueryBlueprint"),
  analysisQueryTechnology: $("#analysisQueryTechnology"),
  analysisQueryMetrics: $("#analysisQueryMetrics"),
  analysisQueryCycles: $("#analysisQueryCycles"),
  analysisQueryTransitions: $("#analysisQueryTransitions"),
  analysisQueryInterpretation: $("#analysisQueryInterpretation"),
  registerRestartBtn: $("#registerRestartBtn"),
  currentCycleTitle: $("#currentCycleTitle"),
  currentCycleMeta: $("#currentCycleMeta"),
  currentCycleCount: $("#currentCycleCount"),
  viewCycleEvidenceBtn: $("#viewCycleEvidenceBtn"),
  restartDialog: $("#restartDialog"),
  closeRestartDialogBtn: $("#closeRestartDialogBtn"),
  restartForm: $("#restartForm"),
  restartServerName: $("#restartServerName"),
  restartUptime: $("#restartUptime"),
  restartServerTime: $("#restartServerTime"),
  restartEvidenceInput: $("#restartEvidenceInput"),
  restartUploadBox: $("#restartUploadBox"),
  restartUploadPlaceholder: $("#restartUploadPlaceholder"),
  restartImagePreviewWrap: $("#restartImagePreviewWrap"),
  restartImagePreview: $("#restartImagePreview"),
  removeRestartEvidenceBtn: $("#removeRestartEvidenceBtn"),
  restartNotes: $("#restartNotes"),
  saveRestartBtn: $("#saveRestartBtn"),
  restartFeedback: $("#restartFeedback"),
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
let currentCycle = null;
let currentCycleRecordCount = 0;
let restartEvidenceBlob = null;
let restartEvidencePreviewUrl = null;
let searchDebounceTimer = null;
let analyticsRecords = [];
let analyticsLoadedAt = null;
let activeAnalysisTab = "summary";

const DUPLICATE_WINDOW_MINUTES = 60;

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

function parseUptimeToSeconds(value) {
  const match = String(value || "").trim().match(/^(\d{1,4}):([0-5]\d):([0-5]\d)$/);
  if (!match) throw new Error("El uptime debe usar formato HH:MM:SS, por ejemplo 00:28:29.");
  return (Number(match[1]) * 3600) + (Number(match[2]) * 60) + Number(match[3]);
}

function formatUptime(seconds) {
  const total = Math.max(0, Number(seconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function parseServerTimestampParts(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6] || 0)
  };
}

function formatServerTimestamp(value, includeSeconds = false) {
  const p = parseServerTimestampParts(value);
  if (!p) return "No indicado";
  const time = includeSeconds
    ? `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}:${String(p.second).padStart(2, "0")}`
    : `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
  return `${String(p.day).padStart(2, "0")}/${String(p.month).padStart(2, "0")}/${p.year} ${time}`;
}

function estimatedServerRestartText(cycle) {
  const p = parseServerTimestampParts(cycle?.server_time_shown);
  if (!p || cycle?.uptime_seconds == null) return null;

  const serverClockMs = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const estimate = new Date(serverClockMs - (Number(cycle.uptime_seconds) * 1000));

  return `${String(estimate.getUTCDate()).padStart(2, "0")}/${String(estimate.getUTCMonth() + 1).padStart(2, "0")}/${estimate.getUTCFullYear()} ` +
    `${String(estimate.getUTCHours()).padStart(2, "0")}:${String(estimate.getUTCMinutes()).padStart(2, "0")}:${String(estimate.getUTCSeconds()).padStart(2, "0")}`;
}

function setRestartEvidencePreview(blob) {
  if (restartEvidencePreviewUrl) URL.revokeObjectURL(restartEvidencePreviewUrl);
  restartEvidencePreviewUrl = blob ? URL.createObjectURL(blob) : null;
  restartEvidenceBlob = blob;

  els.restartImagePreviewWrap.classList.toggle("hidden", !blob);
  els.restartUploadPlaceholder.classList.toggle("hidden", !!blob);

  if (blob) els.restartImagePreview.src = restartEvidencePreviewUrl;
  else els.restartImagePreview.removeAttribute("src");
}

function resetRestartForm() {
  setRestartEvidencePreview(null);
  els.restartEvidenceInput.value = "";
  els.restartServerName.value = currentCycle?.server_name || "Aurora";
  els.restartUptime.value = "";
  els.restartServerTime.value = "";
  els.restartNotes.value = "";
  els.restartFeedback.textContent = "";
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
    .select("*, server_restarts(cycle_number, server_name)", { count: "exact" });

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
    .select("*, server_restarts(cycle_number, server_name)")
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


function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function mean(values) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function fmtNumber(value, digits = 1) {
  if (value == null || Number.isNaN(value)) return "—";
  return Number(value).toLocaleString("es-ES", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0
  });
}

function percent(value, digits = 1) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${fmtNumber(value * 100, digits)}%`;
}

function comboLabel(record, includeType = false) {
  const base = `${record.class_name} · ${record.blueprint} · ${record.technology}`;
  return includeType ? `${record.remnant_type} · ${base}` : base;
}

function commonState(record) {
  return `${record.blueprint} · ${record.technology}`;
}

function expectedCommonStates() {
  const states = [];
  Object.entries(catalog.Comunes).forEach(([blueprint, techs]) => {
    ["Normal", ...techs].forEach(technology => {
      const label = `${blueprint} · ${technology}`;
      if (!states.includes(label)) states.push(label);
    });
  });
  return states;
}

function cycleGroups(rows = analyticsRecords) {
  const groups = new Map();

  rows
    .filter(row => row.server_restart_id && Number.isFinite(Number(row.cycle_position)))
    .forEach(row => {
      const key = row.server_restart_id;
      if (!groups.has(key)) {
        groups.set(key, {
          id: key,
          number: Number(row.server_restarts?.cycle_number ?? 0),
          server: row.server_restarts?.server_name || "—",
          rows: []
        });
      }
      groups.get(key).rows.push(row);
    });

  [...groups.values()].forEach(group => {
    group.rows.sort((a, b) => Number(a.cycle_position) - Number(b.cycle_position));
  });

  return [...groups.values()].sort((a, b) => a.number - b.number);
}

function latestCycleGroup(rows = analyticsRecords) {
  const groups = cycleGroups(rows);
  return groups.length ? groups[groups.length - 1] : null;
}

function intervalsWithinCycles(targetPredicate, basePredicate = () => true) {
  const intervals = [];

  cycleGroups().forEach(group => {
    const base = group.rows.filter(basePredicate);
    base.forEach((row, index) => {
      row.__analysisIndex = index + 1;
    });

    const targetIndexes = base
      .filter(targetPredicate)
      .map(row => row.__analysisIndex);

    for (let i = 1; i < targetIndexes.length; i += 1) {
      intervals.push(targetIndexes[i] - targetIndexes[i - 1]);
    }

    base.forEach(row => delete row.__analysisIndex);
  });

  return intervals;
}

function transitionCounts(targetPredicate, basePredicate = () => true) {
  const previous = new Map();
  const next = new Map();
  let previousSamples = 0;
  let nextSamples = 0;

  cycleGroups().forEach(group => {
    const base = group.rows.filter(basePredicate);

    base.forEach((row, index) => {
      if (!targetPredicate(row)) return;

      if (index > 0) {
        const label = comboLabel(base[index - 1], basePredicate === commonBasePredicate ? false : true);
        previous.set(label, (previous.get(label) || 0) + 1);
        previousSamples += 1;
      }

      if (index < base.length - 1) {
        const label = comboLabel(base[index + 1], basePredicate === commonBasePredicate ? false : true);
        next.set(label, (next.get(label) || 0) + 1);
        nextSamples += 1;
      }
    });
  });

  const sortMap = map => [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  return {
    previous: sortMap(previous),
    next: sortMap(next),
    previousSamples,
    nextSamples
  };
}

function commonBasePredicate(row) {
  if (row.class_name !== "Comunes") return false;
  const type = els.analysisCommonType?.value || "";
  return !type || row.remnant_type === type;
}

function currentCommonElapsed(state) {
  const current = latestCycleGroup();
  if (!current) return null;

  const commonRows = current.rows.filter(commonBasePredicate);
  if (!commonRows.length) return null;

  let lastIndex = null;
  commonRows.forEach((row, index) => {
    if (commonState(row) === state) lastIndex = index;
  });

  if (lastIndex == null) return commonRows.length;
  return (commonRows.length - 1) - lastIndex;
}

function commonStatsForState(state) {
  const predicate = row => commonBasePredicate(row) && commonState(row) === state;
  const matching = analyticsRecords.filter(predicate);
  const intervals = intervalsWithinCycles(
    row => commonState(row) === state,
    commonBasePredicate
  );
  const med = median(intervals);
  const avg = mean(intervals);
  const elapsed = currentCommonElapsed(state);
  const ratio = med && elapsed != null ? elapsed / med : null;

  return {
    state,
    count: matching.length,
    intervals,
    median: med,
    mean: avg,
    elapsed,
    ratio,
    last: matching.length
      ? [...matching].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
      : null
  };
}

function analysisMetric(label, value, detail = "") {
  return `<article class="analysis-metric">
    <span>${esc(label)}</span>
    <strong>${esc(value)}</strong>
    ${detail ? `<small>${esc(detail)}</small>` : ""}
  </article>`;
}

function rankedRows(items, emptyText = "Sin datos suficientes.") {
  if (!items.length) return `<div class="analysis-empty">${esc(emptyText)}</div>`;

  return items.map((item, index) => `
    <div class="analysis-ranked-item">
      <span class="analysis-rank">${index + 1}</span>
      <div>
        <strong>${esc(item.label)}</strong>
        <small>${esc(item.detail || "")}</small>
      </div>
      ${item.value ? `<span class="analysis-rank-value">${esc(item.value)}</span>` : ""}
    </div>
  `).join("");
}

function renderTransitionColumn(title, items, samples) {
  const top = items.slice(0, 5);
  return `<div class="analysis-transition-column">
    <h5>${esc(title)}</h5>
    ${top.length
      ? top.map(item => `
          <div class="analysis-transition-row">
            <span>${esc(item.label)}</span>
            <strong>${item.count}${samples ? ` · ${percent(item.count / samples, 0)}` : ""}</strong>
          </div>
        `).join("")
      : '<div class="analysis-empty">Sin suficientes vecinos observados.</div>'}
    <small>${samples} observaciones utilizables</small>
  </div>`;
}

async function loadAnalyticsRecords() {
  if (!isSuperAdmin()) throw new Error("Solo el superusuario puede abrir el análisis.");

  const all = [];
  const batchSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await sb
      .from("remnant_records")
      .select(`
        id,
        remnant_type,
        class_name,
        blueprint,
        technology,
        evidence_path,
        created_at,
        extra_data,
        server_restart_id,
        cycle_position,
        server_restarts(cycle_number, server_name)
      `)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + batchSize - 1);

    if (error) throw error;

    const batch = data || [];
    all.push(...batch);

    if (batch.length < batchSize) break;
    from += batchSize;
  }

  analyticsRecords = all;
  analyticsLoadedAt = new Date();
}

function renderAnalysisSummary() {
  const total = analyticsRecords.length;
  const withEvidence = analyticsRecords.filter(row => row.evidence_path).length;
  const withCycle = analyticsRecords.filter(row => row.server_restart_id && row.cycle_position != null).length;
  const preCycle = total - withCycle;
  const cycles = cycleGroups();
  const commons = analyticsRecords.filter(row => row.class_name === "Comunes");
  const distinctCommon = new Set(commons.map(commonState)).size;

  els.analysisSummaryMetrics.innerHTML = [
    analysisMetric("Registros", String(total), "histórico completo"),
    analysisMetric("Con evidencia", percent(total ? withEvidence / total : 0), `${withEvidence} de ${total}`),
    analysisMetric("Con ciclo", percent(total ? withCycle / total : 0), `${withCycle} asociados`),
    analysisMetric("Ciclos", String(cycles.length), `${preCycle} registros previos a ciclos`),
    analysisMetric("Comunes", String(commons.length), `${distinctCommon}/${expectedCommonStates().length} combinaciones observadas`)
  ].join("");

  els.analysisCyclesBody.innerHTML = cycles.length
    ? cycles.map(group => {
        const positions = group.rows.map(row => Number(row.cycle_position)).filter(Number.isFinite);
        const max = positions.length ? Math.max(...positions) : 0;
        const min = positions.length ? Math.min(...positions) : 0;
        const expected = max > 0 ? max : group.rows.length;
        const set = new Set(positions);
        const missing = [];

        if (max > 0) {
          for (let p = 1; p <= max; p += 1) {
            if (!set.has(p)) missing.push(p);
          }
        }

        const coverage = expected ? group.rows.length / expected : 0;

        return `<tr>
          <td><strong>#${group.number || "?"}</strong><small>${esc(group.server)}</small></td>
          <td>${group.rows.length}</td>
          <td>${min || "—"}–${max || "—"}</td>
          <td>${percent(coverage)}</td>
          <td>${missing.length
            ? `<span class="analysis-warning">${missing.length} · ${esc(missing.slice(0, 8).join(", "))}${missing.length > 8 ? "…" : ""}</span>`
            : '<span class="analysis-good">Completo</span>'}</td>
        </tr>`;
      }).join("")
    : '<tr><td colspan="5">Aún no hay ciclos registrados.</td></tr>';

  const sc = analyticsRecords.filter(row => row.remnant_type === "SC").length;
  const xc = analyticsRecords.filter(row => row.remnant_type === "XC").length;
  const commonStates = expectedCommonStates().map(commonStatsForState);
  const usefulSignals = commonStates
    .filter(item => item.intervals.length >= 2 && item.ratio != null)
    .sort((a, b) => b.ratio - a.ratio);

  const current = latestCycleGroup();
  const currentCommonRows = current?.rows.filter(row => row.class_name === "Comunes") || [];
  const currentDistinctCommon = new Set(currentCommonRows.map(commonState)).size;

  const cannonPower = commonStatsForState("Cañón · Potente");
  const cannonDetail = cannonPower.intervals.length
    ? `Cañón · Potente tiene ${cannonPower.count} apariciones registradas y ${cannonPower.intervals.length} intervalo(s) comparable(s); mediana: ${fmtNumber(cannonPower.median)} comunes.`
    : `Cañón · Potente tiene ${cannonPower.count} apariciones, pero todavía no hay suficientes repeticiones dentro de ciclos para estimar un intervalo.`;

  const findings = [
    {
      title: "Distribución XC / SC",
      body: `${sc} SC (${percent(total ? sc / total : 0)}) y ${xc} XC (${percent(total ? xc / total : 0)}).`
    },
    {
      title: "Cobertura de comunes",
      body: `Ya aparecen ${distinctCommon} de ${expectedCommonStates().length} combinaciones posibles de la clase Comunes en el histórico.`
    },
    {
      title: "Ciclo actual",
      body: current
        ? `El ciclo #${current.number} tiene ${current.rows.length} registros y ${currentCommonRows.length} comunes; ${currentDistinctCommon} combinaciones comunes distintas.`
        : "Todavía no existe un ciclo actual."
    },
    {
      title: "Pregunta: Cañón Potente",
      body: cannonDetail
    }
  ];

  if (usefulSignals.length) {
    const top = usefulSignals[0];
    findings.push({
      title: "Mayor espera relativa entre comunes",
      body: `${top.state}: lleva ${top.elapsed} comunes desde su última aparición frente a una mediana histórica de ${fmtNumber(top.median)}. Señal relativa ${fmtNumber(top.ratio, 2)}×, basada en ${top.intervals.length} intervalos.`
    });
  }

  findings.push({
    title: "Precaución estadística",
    body: "Una señal alta no significa que el plano vaya a salir enseguida. La pestaña muestra patrones observados y tamaño de muestra; no asume conocer el RNG interno del juego."
  });

  els.analysisFindings.innerHTML = findings.map(item => `
    <article class="analysis-finding">
      <strong>${esc(item.title)}</strong>
      <p>${esc(item.body)}</p>
    </article>
  `).join("");
}

function populateCommonTargets() {
  const current = els.analysisCommonTarget.value;
  const options = expectedCommonStates();

  els.analysisCommonTarget.innerHTML = options
    .map(state => `<option value="${esc(state)}">${esc(state)}</option>`)
    .join("");

  if (options.includes(current)) els.analysisCommonTarget.value = current;
  else if (options.includes("Cañón · Potente")) els.analysisCommonTarget.value = "Cañón · Potente";
}

function renderAnalysisCommons() {
  populateCommonTargets();

  const states = expectedCommonStates().map(commonStatsForState);
  const targetState = els.analysisCommonTarget.value || "Cañón · Potente";
  const target = states.find(item => item.state === targetState) || commonStatsForState(targetState);
  const current = latestCycleGroup();
  const currentCommon = current?.rows.filter(commonBasePredicate) || [];
  const currentDistinct = new Set(currentCommon.map(commonState)).size;

  els.analysisCommonMetrics.innerHTML = [
    analysisMetric("Comunes analizados", String(
      analyticsRecords.filter(commonBasePredicate).length
    ), els.analysisCommonType.value || "XC + SC"),
    analysisMetric("Combinaciones distintas", String(
      new Set(analyticsRecords.filter(commonBasePredicate).map(commonState)).size
    ), `${expectedCommonStates().length} esperadas`),
    analysisMetric(`Apariciones: ${targetState}`, String(target.count), `${target.intervals.length} intervalos útiles`),
    analysisMetric("Mediana del intervalo", target.median == null ? "—" : `${fmtNumber(target.median)} comunes`, "solo dentro del mismo ciclo"),
    analysisMetric("Desde la última", target.elapsed == null ? "—" : `${target.elapsed} comunes`, current ? `ciclo #${current.number}` : "sin ciclo")
  ].join("");

  const targetTransitions = transitionCounts(
    row => commonState(row) === targetState,
    commonBasePredicate
  );

  els.analysisTransitionTitle.textContent = targetState;
  els.analysisTransitions.innerHTML =
    renderTransitionColumn("Suele aparecer antes", targetTransitions.previous, targetTransitions.previousSamples) +
    renderTransitionColumn("Suele aparecer después", targetTransitions.next, targetTransitions.nextSamples);

  const overdue = states
    .filter(item => item.intervals.length >= 2 && item.ratio != null)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 8)
    .map(item => ({
      label: item.state,
      detail: `${item.elapsed} comunes desde última · mediana ${fmtNumber(item.median)} · ${item.intervals.length} intervalos`,
      value: `${fmtNumber(item.ratio, 2)}×`
    }));

  els.analysisOverdueList.innerHTML = rankedRows(
    overdue,
    "Aún faltan repeticiones suficientes para calcular señales de espera."
  );

  els.analysisCommonIntervalsBody.innerHTML = states.map(item => {
    let signal = "Muestra insuficiente";
    let signalClass = "analysis-muted";

    if (item.intervals.length >= 2 && item.ratio != null) {
      if (item.ratio >= 1.5) {
        signal = `${fmtNumber(item.ratio, 2)}× alta`;
        signalClass = "analysis-warning";
      } else if (item.ratio >= 0.8) {
        signal = `${fmtNumber(item.ratio, 2)}× cerca`;
        signalClass = "analysis-good";
      } else {
        signal = `${fmtNumber(item.ratio, 2)}× reciente`;
      }
    }

    return `<tr>
      <td><strong>${esc(item.state)}</strong></td>
      <td>${item.count}</td>
      <td>${item.intervals.length}</td>
      <td>${item.median == null ? "—" : fmtNumber(item.median)}</td>
      <td>${item.mean == null ? "—" : fmtNumber(item.mean)}</td>
      <td>${item.elapsed == null ? "—" : item.elapsed}</td>
      <td><span class="${signalClass}">${esc(signal)}</span></td>
    </tr>`;
  }).join("");
}

function populateAnalysisQueryControls(resetBlueprint = false, resetTechnology = false) {
  const classes = Object.keys(catalog);
  const previousClass = els.analysisQueryClass.value;

  if (!els.analysisQueryClass.options.length) {
    els.analysisQueryClass.innerHTML = classes
      .map(name => `<option value="${esc(name)}">${esc(name)}</option>`)
      .join("");
    els.analysisQueryClass.value = classes.includes("Comunes") ? "Comunes" : classes[0];
  } else if (!classes.includes(previousClass)) {
    els.analysisQueryClass.value = classes[0];
  }

  const className = els.analysisQueryClass.value;
  const blueprints = Object.keys(catalog[className] || {});
  const previousBlueprint = els.analysisQueryBlueprint.value;

  if (resetBlueprint || !blueprints.includes(previousBlueprint)) {
    els.analysisQueryBlueprint.innerHTML = blueprints
      .map(name => `<option value="${esc(name)}">${esc(name)}</option>`)
      .join("");
    els.analysisQueryBlueprint.value = blueprints.includes("Cañón") ? "Cañón" : blueprints[0];
  }

  const blueprint = els.analysisQueryBlueprint.value;
  const technologies = [...new Set(["Normal", ...(catalog[className]?.[blueprint] || [])])];
  const previousTechnology = els.analysisQueryTechnology.value;

  if (resetTechnology || !technologies.includes(previousTechnology)) {
    els.analysisQueryTechnology.innerHTML = technologies
      .map(name => `<option value="${esc(name)}">${esc(name)}</option>`)
      .join("");
    els.analysisQueryTechnology.value = technologies.includes("Potente")
      ? "Potente"
      : technologies[0];
  }
}

function queryCombinationPredicate(row) {
  const type = els.analysisQueryType.value;
  return (!type || row.remnant_type === type)
    && row.class_name === els.analysisQueryClass.value
    && row.blueprint === els.analysisQueryBlueprint.value
    && row.technology === els.analysisQueryTechnology.value;
}

function renderAnalysisQuery() {
  populateAnalysisQueryControls();

  const matches = analyticsRecords.filter(queryCombinationPredicate)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const last = matches.length ? matches[matches.length - 1] : null;
  const cyclesPresent = new Set(matches.filter(row => row.server_restart_id).map(row => row.server_restart_id)).size;
  const cycleIntervals = intervalsWithinCycles(queryCombinationPredicate, () => true);
  const medPositionGap = median(cycleIntervals);

  const current = latestCycleGroup();
  const currentMatches = current?.rows.filter(queryCombinationPredicate) || [];
  const currentLast = currentMatches.length ? currentMatches[currentMatches.length - 1] : null;
  const currentMax = current?.rows.length
    ? Math.max(...current.rows.map(row => Number(row.cycle_position) || 0))
    : null;

  let sinceCurrent = null;
  if (current && currentMax != null) {
    sinceCurrent = currentLast
      ? currentMax - Number(currentLast.cycle_position)
      : currentMax;
  }

  els.analysisQueryMetrics.innerHTML = [
    analysisMetric("Apariciones", String(matches.length), `${cyclesPresent} ciclos con presencia`),
    analysisMetric("Última vez", last ? spainDateTime(last.created_at) : "Nunca", last ? `posición ${last.cycle_position ?? "sin ciclo"}` : ""),
    analysisMetric("Mediana entre apariciones", medPositionGap == null ? "—" : `${fmtNumber(medPositionGap)} registros`, `${cycleIntervals.length} intervalos útiles`),
    analysisMetric("Desde última en ciclo actual", sinceCurrent == null ? "—" : `${sinceCurrent} registros`, current ? `ciclo #${current.number}` : "sin ciclo")
  ].join("");

  const byCycle = cycleGroups()
    .map(group => {
      const rows = group.rows.filter(queryCombinationPredicate);
      return {
        group,
        rows
      };
    })
    .filter(item => item.rows.length)
    .sort((a, b) => b.group.number - a.group.number)
    .slice(0, 10)
    .map(item => ({
      label: `Ciclo #${item.group.number}`,
      detail: `posiciones: ${item.rows.map(row => row.cycle_position).join(", ")}`,
      value: `${item.rows.length}×`
    }));

  els.analysisQueryCycles.innerHTML = rankedRows(
    byCycle,
    "La combinación no aparece dentro de ciclos registrados."
  );

  const transitions = transitionCounts(queryCombinationPredicate, () => true);
  els.analysisQueryTransitions.innerHTML =
    renderTransitionColumn("Antes", transitions.previous, transitions.previousSamples) +
    renderTransitionColumn("Después", transitions.next, transitions.nextSamples);

  if (!matches.length) {
    els.analysisQueryInterpretation.textContent =
      "No hay apariciones registradas de esta combinación. No se puede inferir frecuencia ni secuencia todavía.";
    return;
  }

  const typeText = els.analysisQueryType.value || "XC + SC";
  const parts = [
    `Hay ${matches.length} apariciones registradas (${typeText}).`
  ];

  if (medPositionGap != null) {
    parts.push(`Dentro de ciclos, la mediana entre repeticiones es de ${fmtNumber(medPositionGap)} registros, calculada con ${cycleIntervals.length} intervalos.`);
  } else {
    parts.push("Todavía no hay suficientes repeticiones dentro de un mismo ciclo para calcular una mediana fiable.");
  }

  if (sinceCurrent != null) {
    parts.push(currentLast
      ? `En el ciclo actual han pasado ${sinceCurrent} registros desde su última aparición.`
      : `Todavía no aparece en el ciclo actual, que lleva ${currentMax} posiciones registradas.`);
  }

  if (cycleIntervals.length < 5) {
    parts.push("La muestra sigue siendo pequeña; úsalo como señal descriptiva, no como predicción.");
  }

  els.analysisQueryInterpretation.textContent = parts.join(" ");
}

function renderActiveAnalysisTab() {
  els.analysisSummaryTab.classList.toggle("hidden", activeAnalysisTab !== "summary");
  els.analysisCommonsTab.classList.toggle("hidden", activeAnalysisTab !== "commons");
  els.analysisQueryTab.classList.toggle("hidden", activeAnalysisTab !== "query");

  document.querySelectorAll(".analysis-tab").forEach(button => {
    button.classList.toggle("active", button.dataset.analysisTab === activeAnalysisTab);
  });

  if (activeAnalysisTab === "summary") renderAnalysisSummary();
  if (activeAnalysisTab === "commons") renderAnalysisCommons();
  if (activeAnalysisTab === "query") renderAnalysisQuery();
}

async function refreshAnalysis() {
  els.analysisLoading.classList.remove("hidden");
  els.analysisFeedback.textContent = "";
  els.refreshAnalysisBtn.disabled = true;

  try {
    await loadAnalyticsRecords();
    els.analysisUpdatedAt.textContent = `Actualizado ${spainDateTime(analyticsLoadedAt)}`;
    renderActiveAnalysisTab();
  } catch (error) {
    console.error("Error cargando análisis", error);
    els.analysisFeedback.textContent = `No se pudo cargar el análisis: ${error.message}`;
  } finally {
    els.analysisLoading.classList.add("hidden");
    els.refreshAnalysisBtn.disabled = false;
  }
}

async function openAnalysis() {
  if (!isSuperAdmin()) return;

  els.analysisDialog.showModal();

  if (!analyticsRecords.length) {
    await refreshAnalysis();
  } else {
    renderActiveAnalysisTab();
  }
}

async function loadCurrentCycle() {
  const { data, error } = await sb
    .from("server_restarts")
    .select("*")
    .order("cycle_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  currentCycle = data || null;
  currentCycleRecordCount = 0;

  if (currentCycle) {
    const { count, error: countError } = await sb
      .from("remnant_records")
      .select("id", { count: "exact", head: true })
      .eq("server_restart_id", currentCycle.id);

    if (countError) throw countError;
    currentCycleRecordCount = count ?? 0;
  }
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
    loadMetrics(),
    loadCurrentCycle()
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

function renderCurrentCycle() {
  if (!currentCycle) {
    els.currentCycleTitle.textContent = "Sin ciclo registrado";
    els.currentCycleMeta.textContent = "Los remanentes se asociarán a un ciclo cuando el administrador registre el primer reinicio del servidor.";
    els.currentCycleCount.textContent = "0 remanentes";
    els.viewCycleEvidenceBtn.classList.add("hidden");
    return;
  }

  els.currentCycleTitle.textContent = `Ciclo #${currentCycle.cycle_number} · ${currentCycle.server_name}`;
  const estimate = estimatedServerRestartText(currentCycle);
  const meta = [
    `Reinicio registrado ${spainDateTime(currentCycle.detected_at)}`,
    `Game Info: ${formatServerTimestamp(currentCycle.server_time_shown)}`,
    `uptime ${formatUptime(currentCycle.uptime_seconds)}`
  ];

  if (estimate) meta.push(`inicio estimado ${estimate} (hora mostrada por el servidor)`);

  els.currentCycleMeta.textContent = meta.join(" · ");
  els.currentCycleCount.textContent = currentCycleRecordCount === 1
    ? "1 remanente"
    : `${currentCycleRecordCount} remanentes`;
  els.viewCycleEvidenceBtn.classList.toggle("hidden", !currentCycle.evidence_path);
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
        <small>${esc(record.class_name)}${pilot}${record.server_restarts ? ` · Ciclo #${record.server_restarts.cycle_number} · pos. #${record.cycle_position}` : " · Sin ciclo"}${record.evidence_path ? " · 📷 evidencia" : ""}</small>
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
      <td>${record.server_restarts
        ? `<span class="cycle-cell"><strong>#${record.server_restarts.cycle_number}</strong><small>posición ${record.cycle_position ?? "—"}</small></span>`
        : '<span class="no-evidence">Sin ciclo</span>'}</td>
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
  renderCurrentCycle();
  renderRecent();
  renderHistory();
  renderPagination();
}

function applyAdminUi() {
  const admin = isSuperAdmin();
  document.body.classList.toggle("is-admin", admin);
  els.adminBanner.classList.toggle("hidden", !admin);
  els.analysisBtn.classList.toggle("hidden", !admin);
  els.registerRestartBtn.classList.toggle("hidden", !admin);
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

async function findRecentDuplicate() {
  const cutoff = new Date(Date.now() - (DUPLICATE_WINDOW_MINUTES * 60 * 1000)).toISOString();

  let query = sb
    .from("remnant_records")
    .select("id, created_at, cycle_position, server_restart_id")
    .eq("remnant_type", selectedType)
    .eq("class_name", els.classSelect.value)
    .eq("blueprint", els.blueprintSelect.value)
    .eq("technology", selectedTechnology)
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false })
    .limit(1);

  query = currentCycle?.id
    ? query.eq("server_restart_id", currentCycle.id)
    : query.is("server_restart_id", null);

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

function duplicateRemnantMessage(record = null) {
  let timing = "";
  if (record?.created_at) {
    const elapsedSeconds = Math.max(0, Math.round((Date.now() - new Date(record.created_at).getTime()) / 1000));
    if (elapsedSeconds < 60) {
      timing = " hace menos de un minuto";
    } else {
      timing = ` hace ${Math.max(1, Math.round(elapsedSeconds / 60))} min`;
    }
  }

  const position = record?.cycle_position
    ? ` (posición #${record.cycle_position} del ciclo actual)`
    : "";

  return `⚠️ Este remanente ya fue registrado${timing}${position}. No se creó un duplicado. Los usuarios normales deben esperar 1 hora para repetir la misma combinación; si realmente volvió a salir antes, un administrador puede registrarlo.`;
}

function isDatabaseDuplicateError(error) {
  return error?.code === "23P01";
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

    if (!editingRecordId && !isSuperAdmin()) {
      const duplicate = await findRecentDuplicate();
      if (duplicate) {
        els.feedback.textContent = duplicateRemnantMessage(duplicate);
        return;
      }
    }

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

        if (isDatabaseDuplicateError(error)) {
          els.feedback.textContent = duplicateRemnantMessage();
          return;
        }

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

async function processRestartEvidenceBlob(blob, sourceLabel = "captura") {
  try {
    if (!blob || !blob.type?.startsWith("image/")) {
      throw new Error("El contenido pegado no es una imagen.");
    }

    els.restartFeedback.textContent = `Procesando ${sourceLabel}…`;
    const compressed = await compressImage(blob);
    setRestartEvidencePreview(compressed);
    els.restartFeedback.textContent = `✓ Evidencia lista (${Math.round(compressed.size / 1024)} KB).`;

    els.restartUploadBox.classList.add("paste-flash");
    setTimeout(() => els.restartUploadBox.classList.remove("paste-flash"), 500);
  } catch (error) {
    els.restartFeedback.textContent = `No se pudo procesar la evidencia: ${error.message}`;
  }
}

async function saveServerRestart(event) {
  event.preventDefault();

  if (!isSuperAdmin()) {
    els.restartFeedback.textContent = "Solo el superusuario puede registrar reinicios.";
    return;
  }

  let uploadedPath = null;
  let restartInserted = false;
  els.saveRestartBtn.disabled = true;
  els.restartFeedback.textContent = "Registrando reinicio…";

  try {
    const serverName = els.restartServerName.value.trim();
    const uptimeSeconds = parseUptimeToSeconds(els.restartUptime.value);

    if (!serverName) throw new Error("Indica el nombre del servidor.");
    if (!restartEvidenceBlob) throw new Error("Agrega una captura de evidencia del reinicio.");

    uploadedPath = `${currentUser.id}/server-restarts/${crypto.randomUUID()}.webp`;

    const { error: uploadError } = await sb.storage
      .from("remnant-evidence")
      .upload(uploadedPath, restartEvidenceBlob, {
        contentType: "image/webp",
        upsert: false
      });

    if (uploadError) throw uploadError;

    const payload = {
      server_name: serverName,
      server_time_shown: els.restartServerTime.value || null,
      uptime_seconds: uptimeSeconds,
      evidence_path: uploadedPath,
      notes: els.restartNotes.value.trim() || null
    };

    const { data, error } = await sb
      .from("server_restarts")
      .insert(payload)
      .select()
      .single();

    if (error) {
      await sb.storage.from("remnant-evidence").remove([uploadedPath]);
      throw error;
    }

    restartInserted = true;
    els.restartDialog.close();
    resetRestartForm();
    currentPage = 1;
    await refreshDashboardData();

    els.feedback.textContent =
      `✓ Reinicio registrado. Comienza el ciclo #${data.cycle_number}; el próximo remanente será la posición #1.`;
  } catch (error) {
    if (uploadedPath && !restartInserted) {
      await sb.storage.from("remnant-evidence").remove([uploadedPath]);
    }

    if (restartInserted) {
      els.feedback.textContent = `El reinicio quedó registrado, pero no se pudo refrescar la pantalla: ${error.message}`;
    } else {
      els.restartFeedback.textContent = `No se pudo registrar: ${error.message}`;
    }
  } finally {
    els.saveRestartBtn.disabled = false;
  }
}

async function openCurrentCycleEvidence() {
  if (!currentCycle?.evidence_path) return;

  const { data, error } = await sb.storage
    .from("remnant-evidence")
    .createSignedUrl(currentCycle.evidence_path, 60);

  if (error) {
    els.feedback.textContent = `No se pudo abrir evidencia del reinicio: ${error.message}`;
    return;
  }

  els.dialogTitle.textContent = `Reinicio · Ciclo #${currentCycle.cycle_number} · ${currentCycle.server_name}`;
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
  if (els.analysisDialog.open) els.analysisDialog.close();
  if (els.restartDialog.open) els.restartDialog.close();
  analyticsRecords = [];
  analyticsLoadedAt = null;
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
      .select("*, server_restarts(cycle_number, server_name)");

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
      "fecha_hora_espana", "ciclo", "posicion_ciclo", "servidor",
      "tipo_remanente", "clase", "plano", "tecnologia",
      ...dynamicKeys, "tiene_evidencia"
    ];

    const data = rows.map(record => [
      spainDateTime(record.created_at),
      record.server_restarts?.cycle_number ?? "",
      record.cycle_position ?? "",
      record.server_restarts?.server_name ?? "",
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

  if (els.restartDialog.open && isSuperAdmin()) {
    event.preventDefault();
    await processRestartEvidenceBlob(imageFile, "imagen del portapapeles");
    return;
  }

  // No pegamos una imagen en el formulario principal si hay otro diálogo abierto.
  if (document.querySelector("dialog[open]")) return;

  event.preventDefault();
  await processEvidenceBlob(imageFile, "imagen del portapapeles");
});

document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") {
    const target = els.restartDialog.open ? els.restartUploadBox : els.uploadBox;
    target?.classList.add("paste-ready");
  }
});

document.addEventListener("keyup", event => {
  if (event.key.toLowerCase() === "v" || (!event.ctrlKey && !event.metaKey)) {
    els.uploadBox?.classList.remove("paste-ready");
    els.restartUploadBox?.classList.remove("paste-ready");
  }
});

window.addEventListener("blur", () => {
  els.uploadBox?.classList.remove("paste-ready");
  els.restartUploadBox?.classList.remove("paste-ready");
});

els.restartEvidenceInput.addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;
  await processRestartEvidenceBlob(file, "evidencia seleccionada");
});

els.removeRestartEvidenceBtn.addEventListener("click", event => {
  event.preventDefault();
  event.stopPropagation();
  setRestartEvidencePreview(null);
  els.restartEvidenceInput.value = "";
});

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

els.analysisBtn.addEventListener("click", openAnalysis);
els.closeAnalysisDialogBtn.addEventListener("click", () => els.analysisDialog.close());
els.refreshAnalysisBtn.addEventListener("click", refreshAnalysis);

document.querySelectorAll(".analysis-tab").forEach(button => {
  button.addEventListener("click", () => {
    activeAnalysisTab = button.dataset.analysisTab;
    renderActiveAnalysisTab();
  });
});

els.analysisCommonType.addEventListener("change", renderAnalysisCommons);
els.analysisCommonTarget.addEventListener("change", renderAnalysisCommons);

els.analysisQueryType.addEventListener("change", renderAnalysisQuery);
els.analysisQueryClass.addEventListener("change", () => {
  populateAnalysisQueryControls(true, true);
  renderAnalysisQuery();
});
els.analysisQueryBlueprint.addEventListener("change", () => {
  populateAnalysisQueryControls(false, true);
  renderAnalysisQuery();
});
els.analysisQueryTechnology.addEventListener("change", renderAnalysisQuery);

els.registerRestartBtn.addEventListener("click", () => {
  if (!isSuperAdmin()) return;
  resetRestartForm();
  els.restartDialog.showModal();
});

els.closeRestartDialogBtn.addEventListener("click", () => {
  els.restartDialog.close();
  resetRestartForm();
});

els.restartForm.addEventListener("submit", saveServerRestart);
els.viewCycleEvidenceBtn.addEventListener("click", openCurrentCycleEvidence);

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
