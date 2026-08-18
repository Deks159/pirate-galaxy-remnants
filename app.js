const catalog = {
  "Tormenta": {
    "Misiles": ["Potente", "Rápida"],
    "Mira Computarizada": ["Potente", "Duradera"],
    "Perforador": ["Duradera"],
    "Rayo Térmico": ["Potente", "Duradera"]
  },
  "Tanque": {
    "Escudo": ["Duradera", "Rápida"],
    "Picador": ["Potente", "Duradera"],
    "Señal de interferencia": ["Duradera", "Potente"],
    "Bomba de agresión": ["Potente", "Rápida"]
  },
  "Ingeniero": {
    "Protector": ["Duradera", "Potente"],
    "Telereparador": ["Duradera", "Potente"],
    "Campo de reparación": ["Duradera", "Potente"],
    "Resurrector": ["Duradera", "Potente"]
  },
  "Shock": {
    "Acelerador": ["Duradera", "Potente"],
    "Desacelerador": ["Duradera", "Potente"],
    "Señuelo": ["Duradera", "Potente"],
    "Paralizador": ["Duradera", "Potente"]
  },
  "Sniper": {
    "Largo Alcance": ["Potente", "Rápida"],
    "Droide de ataque": ["Potente", "Duradera"],
    "Ataque Orbital": ["Potente", "Rápida"],
    "Carga de Ataque": ["Potente", "Duradera"]
  },
  "Defensor": {
    "Torre de ataque": ["Duradera", "Potente"],
    "Torre de Reparación": ["Duradera", "Potente"],
    "Mina": ["Duradera", "Potente"],
    "Bomba Lapa": ["Rápida", "Potente"]
  },
  "Luchador": {
    "Inversor de Daño": ["Duradera", "Potente"],
    "Droide Deflector": ["Duradera", "Potente"],
    "Salto Cuántico": ["Rápida", "Potente"],
    "Haz Eléctrico": ["Rápida", "Potente"]
  },
  "Soporte": {
    "Aura Protectora": ["Potente", "Duradera"],
    "Absorbedor de Alcance": ["Potente", "Duradera"],
    "Trampa Magnética": ["Potente", "Duradera"],
    "Nube Corrosiva": ["Potente", "Duradera"]
  },
  "Comunes": {
    "Cañón": ["Potente", "Rápida"],
    "Recolector": [],
    "Reparador": ["Potente", "Duradera"],
    "Impulsor": ["Potente", "Duradera"]
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
let formFields = [];
let currentUser = null;
let editingRecordId = null;
let editingOriginalEvidencePath = null;

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

async function loadRecords() {
  const { data, error } = await sb
    .from("remnant_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  records = data || [];
  renderAll();
}

function filteredRecords() {
  const term = els.searchInput.value.trim().toLocaleLowerCase("es");

  return records.filter(record => {
    const extraValues = Object.values(record.extra_data || {}).join(" ");
    const haystack = `${record.remnant_type} ${record.class_name} ${record.blueprint} ${record.technology} ${extraValues}`
      .toLocaleLowerCase("es");

    return (!term || haystack.includes(term))
      && (!els.filterType.value || record.remnant_type === els.filterType.value)
      && (!els.filterClass.value || record.class_name === els.filterClass.value)
      && (!els.filterTechnology.value || record.technology === els.filterTechnology.value);
  });
}

function renderMetrics() {
  const today = spainDateKey();
  els.metricToday.textContent = records.filter(r => spainDateKey(r.created_at) === today).length;
  els.metricXC.textContent = records.filter(r => r.remnant_type === "XC").length;
  els.metricSC.textContent = records.filter(r => r.remnant_type === "SC").length;
  els.metricTotal.textContent = records.length;
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
  const latest = records.slice(0, 6);
  els.recentCount.textContent = `${records.length} ${records.length === 1 ? "registro" : "registros"}`;

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
  const rows = filteredRecords();
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

function renderAll() {
  renderMetrics();
  renderRecent();
  renderHistory();
}

function applyAdminUi() {
  const admin = isSuperAdmin();
  document.body.classList.toggle("is-admin", admin);
  els.adminBanner.classList.toggle("hidden", !admin);
  els.manageFieldsBtn.classList.toggle("hidden", !admin);

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

      records = records.map(r => r.id === data.id ? data : r);
      els.feedback.textContent = `✓ Registro actualizado: ${data.remnant_type} · ${data.blueprint} · ${data.technology}.`;
      cancelEditMode(false);
      renderAll();
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

      records.unshift(data);
      resetEntryForm();
      els.feedback.textContent = `✓ ${data.remnant_type} · ${data.blueprint} · ${data.technology} registrado a las ${spainTime(data.created_at)} (hora España).`;
      renderAll();
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

    records = records.filter(r => r.id !== record.id);
    if (editingRecordId === record.id) cancelEditMode(false);
    els.feedback.textContent = "✓ Registro eliminado.";
    renderAll();
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
    await loadRecords();
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
  await loadRecords();
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

function exportCsv() {
  const rows = filteredRecords();
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
}

els.remnantTypeGroup.querySelectorAll(".segment").forEach(btn => {
  btn.addEventListener("click", () => setSelectedType(btn.dataset.value));
});

els.classSelect.addEventListener("change", populateBlueprints);
els.blueprintSelect.addEventListener("change", () => populateTechnologies());

els.evidenceInput.addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    els.feedback.textContent = "Procesando evidencia…";
    const blob = await compressImage(file);
    setEvidencePreview(blob);
    els.feedback.textContent = `Evidencia lista (${Math.round(blob.size / 1024)} KB).`;
  } catch (error) {
    els.feedback.textContent = error.message;
    event.target.value = "";
  }
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

[els.searchInput, els.filterType, els.filterClass, els.filterTechnology].forEach(el => {
  el.addEventListener(el.tagName === "INPUT" ? "input" : "change", renderHistory);
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
    await loadRecords();
    els.feedback.textContent = "✓ Conectado a Supabase. La hora la asigna PostgreSQL.";
  } catch (error) {
    els.feedback.textContent = `Error al conectar con Supabase: ${error.message}`;
  }
})();
