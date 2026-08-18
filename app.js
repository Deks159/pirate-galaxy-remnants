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
    "Recolector": ["Normal"],
    "Reparador": ["Potente", "Duradera"],
    "Impulsor": ["Potente", "Duradera"]
  }
};

const els = {
  spainClock: document.querySelector("#spainClock"),
  remnantTypeGroup: document.querySelector("#remnantTypeGroup"),
  classSelect: document.querySelector("#classSelect"),
  blueprintSelect: document.querySelector("#blueprintSelect"),
  technologyGroup: document.querySelector("#technologyGroup"),
  evidenceInput: document.querySelector("#evidenceInput"),
  uploadPlaceholder: document.querySelector("#uploadPlaceholder"),
  imagePreviewWrap: document.querySelector("#imagePreviewWrap"),
  imagePreview: document.querySelector("#imagePreview"),
  removeEvidenceBtn: document.querySelector("#removeEvidenceBtn"),
  saveBtn: document.querySelector("#saveBtn"),
  feedback: document.querySelector("#formFeedback"),
  recentList: document.querySelector("#recentList"),
  recentCount: document.querySelector("#recentCount"),
  historyBody: document.querySelector("#historyBody"),
  emptyHistory: document.querySelector("#emptyHistory"),
  searchInput: document.querySelector("#searchInput"),
  filterType: document.querySelector("#filterType"),
  filterClass: document.querySelector("#filterClass"),
  filterTechnology: document.querySelector("#filterTechnology"),
  exportBtn: document.querySelector("#exportBtn"),
  metricToday: document.querySelector("#metricToday"),
  metricXC: document.querySelector("#metricXC"),
  metricSC: document.querySelector("#metricSC"),
  metricTotal: document.querySelector("#metricTotal"),
  dialog: document.querySelector("#evidenceDialog"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogImage: document.querySelector("#dialogImage"),
  closeDialogBtn: document.querySelector("#closeDialogBtn")
};

let selectedType = "XC";
let selectedTechnology = "";
let evidenceBlob = null;
let evidencePreviewUrl = null;
let records = [];

const DB_NAME = "pirateGalaxyRemnantLog";
const DB_VERSION = 1;
const STORE = "records";
let dbPromise;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

async function getAllRecords() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    req.onerror = () => reject(req.error);
  });
}

async function addRecord(record) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const req = tx.objectStore(STORE).add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function spainParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map(p => [p.type, p.value]));
  return parts;
}

function spainDateTime(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    dateStyle: "medium",
    timeStyle: "medium"
  }).format(date);
}

function spainTime(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(date);
}

function spainDateKey(date = new Date()) {
  const p = spainParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

function updateClock() {
  const p = spainParts();
  els.spainClock.textContent = `${p.hour}:${p.minute}:${p.second}`;
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

function populateTechnologies() {
  const technologies = catalog[els.classSelect.value][els.blueprintSelect.value];
  els.technologyGroup.innerHTML = "";
  selectedTechnology = technologies[0];
  technologies.forEach((technology, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tech-btn${index === 0 ? " active" : ""}`;
    btn.dataset.value = technology;
    btn.textContent = technology;
    btn.addEventListener("click", () => {
      selectedTechnology = technology;
      els.technologyGroup.querySelectorAll(".tech-btn").forEach(x => x.classList.toggle("active", x === btn));
    });
    els.technologyGroup.appendChild(btn);
  });
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
  if (!file.type.startsWith("image/")) throw new Error("Selecciona un archivo de imagen.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("No se pudo procesar la imagen.")), "image/webp", quality);
  });
}

function getFilteredRecords() {
  const q = els.searchInput.value.trim().toLocaleLowerCase("es");
  return records.filter(r => {
    const haystack = `${r.type} ${r.className} ${r.blueprint} ${r.technology}`.toLocaleLowerCase("es");
    return (!q || haystack.includes(q))
      && (!els.filterType.value || r.type === els.filterType.value)
      && (!els.filterClass.value || r.className === els.filterClass.value)
      && (!els.filterTechnology.value || r.technology === els.filterTechnology.value);
  });
}

function renderMetrics() {
  const todayKey = spainDateKey();
  els.metricToday.textContent = records.filter(r => spainDateKey(new Date(r.createdAt)) === todayKey).length;
  els.metricXC.textContent = records.filter(r => r.type === "XC").length;
  els.metricSC.textContent = records.filter(r => r.type === "SC").length;
  els.metricTotal.textContent = records.length;
}

function renderRecent() {
  const latest = records.slice(0, 6);
  els.recentCount.textContent = `${records.length} ${records.length === 1 ? "registro" : "registros"}`;
  if (!latest.length) {
    els.recentList.innerHTML = '<div class="recent-empty">Aún no hay remanentes registrados.<br>El primer registro aparecerá aquí.</div>';
    return;
  }
  els.recentList.innerHTML = "";
  latest.forEach(r => {
    const item = document.createElement("div");
    item.className = "recent-item";
    item.innerHTML = `
      <div class="type-pill">${r.type}</div>
      <div class="recent-copy">
        <strong>${escapeHtml(r.blueprint)} · ${escapeHtml(r.technology)}</strong>
        <small>${escapeHtml(r.className)}${r.evidence ? " · 📷 evidencia" : ""}</small>
      </div>
      <div class="recent-time">${spainTime(r.createdAt)}</div>
    `;
    els.recentList.appendChild(item);
  });
}

function renderHistory() {
  const filtered = getFilteredRecords();
  els.historyBody.innerHTML = "";
  els.emptyHistory.classList.toggle("hidden", filtered.length > 0);

  filtered.forEach(r => {
    const tr = document.createElement("tr");
    const evidenceCell = r.evidence
      ? `<button type="button" class="evidence-btn" data-id="${r.id}">Ver foto</button>`
      : `<span class="no-evidence">Sin foto</span>`;
    tr.innerHTML = `
      <td>${spainDateTime(r.createdAt)}</td>
      <td><strong>${r.type}</strong></td>
      <td>${escapeHtml(r.className)}</td>
      <td>${escapeHtml(r.blueprint)}</td>
      <td>${escapeHtml(r.technology)}</td>
      <td>${evidenceCell}</td>
    `;
    els.historyBody.appendChild(tr);
  });

  els.historyBody.querySelectorAll(".evidence-btn").forEach(btn => {
    btn.addEventListener("click", () => openEvidence(Number(btn.dataset.id)));
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function renderAll() {
  renderMetrics();
  renderRecent();
  renderHistory();
}

async function saveCurrentRecord() {
  els.feedback.textContent = "";
  const now = new Date();
  const record = {
    type: selectedType,
    className: els.classSelect.value,
    blueprint: els.blueprintSelect.value,
    technology: selectedTechnology,
    createdAt: now.toISOString(),
    timezone: "Europe/Madrid",
    evidence: evidenceBlob || null
  };

  try {
    const id = await addRecord(record);
    record.id = id;
    records.unshift(record);
    const p = spainParts(now);
    els.feedback.textContent = `✓ ${record.type} · ${record.blueprint} · ${record.technology} registrado a las ${p.hour}:${p.minute}:${p.second}.`;
    setEvidencePreview(null);
    els.evidenceInput.value = "";
    renderAll();
  } catch (error) {
    els.feedback.textContent = `No se pudo guardar: ${error.message}`;
  }
}

function openEvidence(id) {
  const record = records.find(r => r.id === id);
  if (!record?.evidence) return;
  if (els.dialogImage.dataset.url) URL.revokeObjectURL(els.dialogImage.dataset.url);
  const url = URL.createObjectURL(record.evidence);
  els.dialogImage.dataset.url = url;
  els.dialogImage.src = url;
  els.dialogTitle.textContent = `${record.type} · ${record.blueprint} · ${record.technology}`;
  els.dialog.showModal();
}

function closeEvidence() {
  els.dialog.close();
  if (els.dialogImage.dataset.url) {
    URL.revokeObjectURL(els.dialogImage.dataset.url);
    delete els.dialogImage.dataset.url;
  }
  els.dialogImage.removeAttribute("src");
}

function exportCsv() {
  const rows = getFilteredRecords();
  const header = ["fecha_hora_espana","tipo_remanente","clase","plano","tecnologia","tiene_evidencia"];
  const data = rows.map(r => [
    spainDateTime(r.createdAt), r.type, r.className, r.blueprint, r.technology, r.evidence ? "Sí" : "No"
  ]);
  const csv = [header, ...data]
    .map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `remnant-log-${spainDateKey()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

els.remnantTypeGroup.querySelectorAll(".segment").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedType = btn.dataset.value;
    els.remnantTypeGroup.querySelectorAll(".segment").forEach(x => x.classList.toggle("active", x === btn));
  });
});

els.classSelect.addEventListener("change", populateBlueprints);
els.blueprintSelect.addEventListener("change", populateTechnologies);
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
els.saveBtn.addEventListener("click", saveCurrentRecord);
[els.searchInput, els.filterType, els.filterClass, els.filterTechnology].forEach(el => {
  el.addEventListener(el.tagName === "INPUT" ? "input" : "change", renderHistory);
});
els.exportBtn.addEventListener("click", exportCsv);
els.closeDialogBtn.addEventListener("click", closeEvidence);
els.dialog.addEventListener("click", event => {
  if (event.target === els.dialog) closeEvidence();
});

(async function init() {
  populateClasses();
  updateClock();
  setInterval(updateClock, 1000);
  try {
    records = await getAllRecords();
    renderAll();
  } catch (error) {
    els.feedback.textContent = "El navegador no permitió abrir el almacenamiento local.";
  }
})();
