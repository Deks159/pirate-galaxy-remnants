const catalog = {
  "Tormenta": {"Misiles":["Potente","Rápida"],"Mira Computarizada":["Potente","Duradera"],"Perforador":["Duradera"],"Rayo Térmico":["Potente","Duradera"]},
  "Tanque": {"Escudo":["Duradera","Rápida"],"Picador":["Potente","Duradera"],"Señal de interferencia":["Duradera","Potente"],"Bomba de agresión":["Potente","Rápida"]},
  "Ingeniero": {"Protector":["Duradera","Potente"],"Telereparador":["Duradera","Potente"],"Campo de reparación":["Duradera","Potente"],"Resurrector":["Duradera","Potente"]},
  "Shock": {"Acelerador":["Duradera","Potente"],"Desacelerador":["Duradera","Potente"],"Señuelo":["Duradera","Potente"],"Paralizador":["Duradera","Potente"]},
  "Sniper": {"Largo Alcance":["Potente","Rápida"],"Droide de ataque":["Potente","Duradera"],"Ataque Orbital":["Potente","Rápida"],"Carga de Ataque":["Potente","Duradera"]},
  "Defensor": {"Torre de ataque":["Duradera","Potente"],"Torre de Reparación":["Duradera","Potente"],"Mina":["Duradera","Potente"],"Bomba Lapa":["Rápida","Potente"]},
  "Luchador": {"Inversor de Daño":["Duradera","Potente"],"Droide Deflector":["Duradera","Potente"],"Salto Cuántico":["Rápida","Potente"],"Haz Eléctrico":["Rápida","Potente"]},
  "Soporte": {"Aura Protectora":["Potente","Duradera"],"Absorbedor de Alcance":["Potente","Duradera"],"Trampa Magnética":["Potente","Duradera"],"Nube Corrosiva":["Potente","Duradera"]},
  "Comunes": {"Cañón":["Potente","Rápida"],"Recolector":["Normal"],"Reparador":["Potente","Duradera"],"Impulsor":["Potente","Duradera"]}
};

const cfg = window.REMNANT_CONFIG || {};
const configured = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_URL.includes("TU-PROYECTO") && !cfg.SUPABASE_ANON_KEY.includes("TU-");
const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

const els = {
  spainClock: document.querySelector("#spainClock"), remnantTypeGroup: document.querySelector("#remnantTypeGroup"),
  classSelect: document.querySelector("#classSelect"), blueprintSelect: document.querySelector("#blueprintSelect"), technologyGroup: document.querySelector("#technologyGroup"),
  evidenceInput: document.querySelector("#evidenceInput"), uploadPlaceholder: document.querySelector("#uploadPlaceholder"), imagePreviewWrap: document.querySelector("#imagePreviewWrap"),
  imagePreview: document.querySelector("#imagePreview"), removeEvidenceBtn: document.querySelector("#removeEvidenceBtn"), saveBtn: document.querySelector("#saveBtn"),
  feedback: document.querySelector("#formFeedback"), recentList: document.querySelector("#recentList"), recentCount: document.querySelector("#recentCount"), historyBody: document.querySelector("#historyBody"),
  emptyHistory: document.querySelector("#emptyHistory"), searchInput: document.querySelector("#searchInput"), filterType: document.querySelector("#filterType"), filterClass: document.querySelector("#filterClass"),
  filterTechnology: document.querySelector("#filterTechnology"), exportBtn: document.querySelector("#exportBtn"), metricToday: document.querySelector("#metricToday"), metricXC: document.querySelector("#metricXC"),
  metricSC: document.querySelector("#metricSC"), metricTotal: document.querySelector("#metricTotal"), dialog: document.querySelector("#evidenceDialog"), dialogTitle: document.querySelector("#dialogTitle"),
  dialogImage: document.querySelector("#dialogImage"), closeDialogBtn: document.querySelector("#closeDialogBtn")
};

let selectedType="XC", selectedTechnology="", evidenceBlob=null, evidencePreviewUrl=null, records=[], currentUser=null;

function spainParts(date=new Date()) {
  return Object.fromEntries(new Intl.DateTimeFormat("es-ES",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).formatToParts(date).map(p=>[p.type,p.value]));
}
function spainDateTime(v){return new Intl.DateTimeFormat("es-ES",{timeZone:"Europe/Madrid",dateStyle:"medium",timeStyle:"medium"}).format(new Date(v));}
function spainTime(v){return new Intl.DateTimeFormat("es-ES",{timeZone:"Europe/Madrid",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date(v));}
function spainDateKey(v=new Date()){const p=spainParts(new Date(v));return `${p.year}-${p.month}-${p.day}`;}
function updateClock(){const p=spainParts();els.spainClock.textContent=`${p.hour}:${p.minute}:${p.second}`;}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

function populateClasses(){Object.keys(catalog).forEach(name=>{els.classSelect.add(new Option(name,name));els.filterClass.add(new Option(name,name));});populateBlueprints();}
function populateBlueprints(){const cls=els.classSelect.value;els.blueprintSelect.innerHTML="";Object.keys(catalog[cls]).forEach(name=>els.blueprintSelect.add(new Option(name,name)));populateTechnologies();}
function populateTechnologies(){const arr=catalog[els.classSelect.value][els.blueprintSelect.value];selectedTechnology=arr[0];els.technologyGroup.innerHTML="";arr.forEach((t,i)=>{const b=document.createElement("button");b.type="button";b.className=`tech-btn${i===0?" active":""}`;b.textContent=t;b.onclick=()=>{selectedTechnology=t;els.technologyGroup.querySelectorAll(".tech-btn").forEach(x=>x.classList.toggle("active",x===b));};els.technologyGroup.appendChild(b);});}

function setEvidencePreview(blob){if(evidencePreviewUrl)URL.revokeObjectURL(evidencePreviewUrl);evidencePreviewUrl=blob?URL.createObjectURL(blob):null;evidenceBlob=blob;els.imagePreviewWrap.classList.toggle("hidden",!blob);els.uploadPlaceholder.classList.toggle("hidden",!!blob);if(blob)els.imagePreview.src=evidencePreviewUrl;else els.imagePreview.removeAttribute("src");}
async function compressImage(file,maxSide=1600,quality=.82){if(!file.type.startsWith("image/"))throw new Error("Selecciona una imagen.");const bitmap=await createImageBitmap(file);const scale=Math.min(1,maxSide/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement("canvas");canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext("2d").drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("No se pudo procesar la imagen.")),"image/webp",quality));}

async function ensureAnonymousSession(){const {data:{session}}=await sb.auth.getSession();if(session){currentUser=session.user;return;}const {data,error}=await sb.auth.signInAnonymously();if(error)throw error;currentUser=data.user;}
async function loadRecords(){const {data,error}=await sb.from("remnant_records").select("*").order("created_at",{ascending:false});if(error)throw error;records=data||[];renderAll();}
function filteredRecords(){const term=els.searchInput.value.trim().toLocaleLowerCase("es");return records.filter(r=>{const h=`${r.remnant_type} ${r.class_name} ${r.blueprint} ${r.technology}`.toLocaleLowerCase("es");return(!term||h.includes(term))&&(!els.filterType.value||r.remnant_type===els.filterType.value)&&(!els.filterClass.value||r.class_name===els.filterClass.value)&&(!els.filterTechnology.value||r.technology===els.filterTechnology.value);});}
function renderMetrics(){const today=spainDateKey();els.metricToday.textContent=records.filter(r=>spainDateKey(r.created_at)===today).length;els.metricXC.textContent=records.filter(r=>r.remnant_type==="XC").length;els.metricSC.textContent=records.filter(r=>r.remnant_type==="SC").length;els.metricTotal.textContent=records.length;}
function renderRecent(){const latest=records.slice(0,6);els.recentCount.textContent=`${records.length} ${records.length===1?"registro":"registros"}`;if(!latest.length){els.recentList.innerHTML='<div class="recent-empty">Aún no hay remanentes registrados.</div>';return;}els.recentList.innerHTML=latest.map(r=>`<div class="recent-item"><div class="type-pill">${r.remnant_type}</div><div class="recent-copy"><strong>${esc(r.blueprint)} · ${esc(r.technology)}</strong><small>${esc(r.class_name)}${r.evidence_path?" · 📷 evidencia":""}</small></div><div class="recent-time">${spainTime(r.created_at)}</div></div>`).join("");}
function renderHistory(){const rows=filteredRecords();els.historyBody.innerHTML="";els.emptyHistory.classList.toggle("hidden",rows.length>0);rows.forEach(r=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${spainDateTime(r.created_at)}</td><td><strong>${r.remnant_type}</strong></td><td>${esc(r.class_name)}</td><td>${esc(r.blueprint)}</td><td>${esc(r.technology)}</td><td>${r.evidence_path?`<button type="button" class="evidence-btn" data-id="${r.id}">Ver foto</button>`:'<span class="no-evidence">Sin foto</span>'}</td>`;els.historyBody.appendChild(tr);});els.historyBody.querySelectorAll(".evidence-btn").forEach(b=>b.onclick=()=>openEvidence(b.dataset.id));}
function renderAll(){renderMetrics();renderRecent();renderHistory();}

async function saveCurrentRecord(){if(!configured){els.feedback.textContent="Configura Supabase en config.js antes de registrar.";return;}els.saveBtn.disabled=true;els.feedback.textContent="Guardando en Supabase…";let evidencePath=null;try{if(evidenceBlob){evidencePath=`${currentUser.id}/${crypto.randomUUID()}.webp`;const {error:upErr}=await sb.storage.from("remnant-evidence").upload(evidencePath,evidenceBlob,{contentType:"image/webp",upsert:false});if(upErr)throw upErr;}const payload={remnant_type:selectedType,class_name:els.classSelect.value,blueprint:els.blueprintSelect.value,technology:selectedTechnology,evidence_path:evidencePath};const {data,error}=await sb.from("remnant_records").insert(payload).select().single();if(error){if(evidencePath)await sb.storage.from("remnant-evidence").remove([evidencePath]);throw error;}records.unshift(data);setEvidencePreview(null);els.evidenceInput.value="";els.feedback.textContent=`✓ ${data.remnant_type} · ${data.blueprint} · ${data.technology} registrado a las ${spainTime(data.created_at)} (hora España).`;renderAll();}catch(e){els.feedback.textContent=`No se pudo guardar: ${e.message}`;}finally{els.saveBtn.disabled=false;}}
async function openEvidence(id){const r=records.find(x=>String(x.id)===String(id));if(!r?.evidence_path)return;const {data,error}=await sb.storage.from("remnant-evidence").createSignedUrl(r.evidence_path,60);if(error){els.feedback.textContent=`No se pudo abrir evidencia: ${error.message}`;return;}els.dialogTitle.textContent=`${r.remnant_type} · ${r.blueprint} · ${r.technology}`;els.dialogImage.src=data.signedUrl;els.dialog.showModal();}
function exportCsv(){const rows=filteredRecords(),header=["fecha_hora_espana","tipo_remanente","clase","plano","tecnologia","tiene_evidencia"];const csv=[header,...rows.map(r=>[spainDateTime(r.created_at),r.remnant_type,r.class_name,r.blueprint,r.technology,r.evidence_path?"Sí":"No"])].map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");const url=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=`remnant-log-${spainDateKey()}.csv`;a.click();URL.revokeObjectURL(url);}

els.remnantTypeGroup.querySelectorAll(".segment").forEach(btn=>btn.onclick=()=>{selectedType=btn.dataset.value;els.remnantTypeGroup.querySelectorAll(".segment").forEach(x=>x.classList.toggle("active",x===btn));});
els.classSelect.onchange=populateBlueprints;els.blueprintSelect.onchange=populateTechnologies;
els.evidenceInput.onchange=async e=>{const file=e.target.files[0];if(!file)return;try{els.feedback.textContent="Procesando evidencia…";const blob=await compressImage(file);setEvidencePreview(blob);els.feedback.textContent=`Evidencia lista (${Math.round(blob.size/1024)} KB).`;}catch(err){els.feedback.textContent=err.message;e.target.value="";}};
els.removeEvidenceBtn.onclick=e=>{e.preventDefault();e.stopPropagation();setEvidencePreview(null);els.evidenceInput.value="";};
els.saveBtn.onclick=saveCurrentRecord;[els.searchInput,els.filterType,els.filterClass,els.filterTechnology].forEach(el=>el.addEventListener(el.tagName==="INPUT"?"input":"change",renderHistory));els.exportBtn.onclick=exportCsv;els.closeDialogBtn.onclick=()=>els.dialog.close();

(async function init(){populateClasses();updateClock();setInterval(updateClock,1000);if(!configured){els.feedback.textContent="⚠ Falta configurar Supabase en config.js. Puedes visualizar la interfaz, pero aún no guardará datos.";renderAll();return;}try{await ensureAnonymousSession();await loadRecords();els.feedback.textContent="✓ Conectado a Supabase. Los registros son compartidos y la hora la asigna PostgreSQL.";}catch(e){els.feedback.textContent=`Error al conectar con Supabase: ${e.message}`;}})();
