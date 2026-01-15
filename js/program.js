// =============================================================
// Program page renderer (organized)
// - 3-color system: purple/blue/white handled in CSS
// - Only 3 pattern classes used: pattern-a / pattern-b / pattern-c
// - Break rows: simple (is-break class)
// - Invited rows: uses one of the 3 patterns (pattern-b here)
// =============================================================

const PROGRAM_DATA = {
  schedule: [
    { time: "9:00am - 9:50am", name: "Keynote 1", authors: "Catherine Fang", title: "Responsible AI in AgeTech and Neuroscience" },
    { time: "9:50am - 10:00am", name: "Spotlight Paper Talk 1", authors: "Suparshva Jain, Amit Sangroya, Lovekesh Vig", title: "DERM-Clu: A Diffusion-based Explainable Representation Model for Dermatology" },
    { time: "10:00am - 10:45am", name: "Poster Session 1" },
    { time: "10:30am - 11:00am", name: "Break 1" },
    { time: "11:00 am - 11:50 am", name: "Keynote 2", authors: "Aditava Das", title: "MedLLM Safety Pathology: Breaking—and Fixing—Clinical Reasoning" },
    { time: "11:50 am - 12:00noon", name: "Spotlight Paper Talk 2", authors: "Shaida Chang, Rishi Kumar, Hanlei Wang, Timothy J. Flowers, Dina El Khoury, Bo Wang", title: "\"Side Effects May Include\": Alignment Decay from Counterfactual Self-Training" },
    { time: "12:00noon - 1:30pm", name: "Lunch Break" },
    { time: "1:30pm - 2:20pm", name: "Invited Talk 1", authors: "Neta Aharony", title: "AI for virtual cells for pharma manufacturing" },
    { time: "2:20pm - 3:20pm", name: "Panel Discussion", authors: "Ahmed Alaa, Mariana Zuluaga, Joelle Pineau, Neta Aharony", title: "AI, the SIR Model, and DE-Constrained Kernel Smoothing for Pandemic Forecasting: Responsible AI/ML and UQ in Public Health" },
    { time: "3:20pm - 3:30pm", name: "Spotlight Paper Talk 3", authors: "Sarah Fani, Seyedbehzad H. Mousavi, Yaser A. Sheikh", title: "SPACE: Sparsely Primed Autoencoder Counterfactual Explanations for Time-Series Clinical Data" },
    { time: "3:30pm - 4:00pm", name: "Break 2" },
    { time: "4:00pm - 4:45pm", name: "Poster Session 2" },
    { time: "4:45pm - 5:00pm", name: "Closing Remarks" }
  ],
  poster1: [
    "Unsupervised Single-lead ECG Anomaly Detection using Conformer-based AutoEncoder with Random Masking Augmentation",
    "Towards Reliable Few-Shot Adaptation of Pathology Foundation Models via Conformal Prediction",
    "Train-Only–Constrained LM for Synthetic Clinical Trajectories: Leak-Safe Calibration and Auditable Dynamics",
    "Mapping Clinical Doubt: Locating Linguistic Uncertainty in LLMs",
    "Uncertainty-Aware Reinforcement Learning for Robust and Interpretable Anomaly Detection",
    "Weight Entropy-Maximised Evidential Metamodel for Post-Hoc Uncertainty Quantification",
    "Adaptive Conformal Prediction via Bayesian Uncertainty Weighting for Hierarchical Healthcare Data",
    "Towards Robust and Fair Next Visit Diagnosis Prediction under Noisy Clinical Notes with Large Language Models",
    "Responsible AI Evaluation in Clinical Machine Learning: A Study on In-Hospital Mortality Prediction Using MIMIC-IV",
    "BLUFF-1000: Measuring Uncertainty Expression in RAG",
    "VariantBench: A Framework for Evaluating LLMs on Justifications for Genetic Variant Interpretation",
    "Towards Trustworthy Clinical AI: Integrating Uncertainty Quantification and Explainability for Sepsis Prediction",
    "FAIR Voice Biomarker Data for Secure and Trustworthy GenAI in Health: A Cross-Domain Assessment",
    "Assessing the Quality of Mental Health Support in LLM Responses through Multi-Attribute Human Evaluation"
  ],
  poster2: [
    "A-IEOF: Anchored Interventional Equalized-Odds Fairness for Feature Addition",
    "Regulatory Frameworks for AI in Medical Devices: Cross-Jurisd...on Certification, Implementation, and Post-Market Surveillance",
    "Radiation-Preserving Selective Imaging for Pediatric Hip Dysp...asia: A Cross-Modal Ultrasound–Xray Policy with Limited Labels",
    "Emergent Zero-Shot Global OOD Performance in Multimodal Mammography Models",
    "Robust and Interpretable Multimodal Fusion in Med-VQA: A Perturbation Benchmark for Clinical Safety",
    "FedHypeVAE: Federated Learning with Hypernetwork-Generated Conditional VAEs for Differentially-Private Embedding Sharing",
    "Integrating SHAP Explanations to improve LLM Prediction for adverse clinical events",
    "Trust-X: Towards Transparent and Safe Multi-Agent Reasoning",
    "Expert Opinion in the Automatic Variable Selection World",
    "Assessing Fairness and Generalizability in Foundation Models for Skin Lesion Classification",
    "Open-World, Open-Mic: What Fails—and What Works—Against AV Deepfakes",
    "GUARDIAN: Gated Uncertainty-Aware Runtime Dual Invariants for EEG-Controlled Assistive Agents",
    "EmoMed: An Emotionally-Aware Agent for Multimodal Medical Support with Real-Time Information Retrieval"
  ]
};

const els = {
  tabs: document.querySelectorAll(".program-tab"),
  panel: document.getElementById("programPanel"),
  empty: document.getElementById("programEmpty"),
  search: document.getElementById("programSearch"),
};

let state = { tab: "schedule", q: "" };

function normalize(s){ return (s || "").toString().toLowerCase().trim(); }
function matchesQuery(text){
  const q = normalize(state.q);
  if(!q) return true;
  return normalize(text).includes(q);
}

function scheduleType(name){
  const n = normalize(name);
  if (n.includes("keynote")) return "Keynote";
  if (n.includes("spotlight")) return "Spotlight";
  if (n.includes("poster")) return "Poster";
  if (n.includes("break")) return "Break";
  if (n.includes("lunch")) return "Lunch";
  if (n.includes("panel")) return "Panel";
  if (n.includes("invited")) return "Invited";
  if (n.includes("closing")) return "Closing";
  return "Other";
}

/**
 * Only 3 pattern designs:
 * - pattern-a (purple dots)
 * - pattern-b (blue diagonal)
 * - pattern-c (purple+blue grid)
 * Break uses none (simple).
 *
 * Invited: explicitly assign ONE of the three patterns => pattern-b.
 */
function patternForType(type){
  switch(type){
    case "Keynote":   return "pattern-c";
    case "Spotlight": return "pattern-b";
    case "Poster":    return "pattern-a";
    case "Panel":     return "pattern-c";
    case "Lunch":     return "pattern-b";
    case "Invited":   return "pattern-b";   // as requested: one of the three
    case "Closing":   return "pattern-c";
    case "Break":     return "";            // no pattern; handled by is-break
    default:          return "pattern-a";
  }
}

function groupForItem(item){
  const n = normalize(item.name);
  if (n.includes("lunch")) return "Midday";
  const t = normalize(item.time);
  if (t.includes("9:") || t.includes("10:") || t.includes("11:")) return "Morning";
  if (t.includes("12:") || t.includes("1:")) return "Midday";
  return "Afternoon";
}

function setActiveTab(tabName){
  state.tab = tabName;
  state.q = "";
  if(els.search) els.search.value = "";

  els.tabs.forEach(btn => {
    const active = btn.dataset.tab === tabName;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });

  render();
}

function makeGroupHeader(title, hint){
  const wrap = document.createElement("div");
  wrap.className = "program-group__header";
  wrap.innerHTML = `
    <h3 class="program-group__title">${title}</h3>
    <p class="program-group__hint">${hint}</p>
  `;
  return wrap;
}

function makeScheduleCard(item){
  const type = scheduleType(item.name);
  const pattern = patternForType(type);
  const isBreak = type === "Break";

  const card = document.createElement("article");
  card.className = `program-card ${pattern} ${isBreak ? "is-break" : ""}`.trim();

  // pattern layer (if not break)
  if(!isBreak){
    const layer = document.createElement("div");
    layer.className = "pattern-layer";
    card.appendChild(layer);
  }

  const row = document.createElement("div");
  row.className = "program-row";

  // Left: time (label + pill)
  const left = document.createElement("div");
  left.innerHTML = `
    <div class="program-time">
      <div class="program-time__label">Time</div>
      <div class="program-time__pill">${item.time}</div>
    </div>
  `;

  // Middle: tag + presenter/session label
  const presenterText = item.authors ? item.authors : item.name;

  const middle = document.createElement("div");
  middle.className = "program-mid";
  middle.innerHTML = `
    <span class="program-badge">${type}</span>
    <span class="program-presenter">${presenterText || ""}</span>
  `;

  // Right: title reveal + posters
  const right = document.createElement("div");
  right.className = "program-right";

  if(item.title){
    const labelText =
        type === "Panel" ? "Panel theme" :
        (type === "Poster" ? "Poster title" : "Talk title");

    const wrap = document.createElement("div");
    wrap.className = "program-titlewrap";

    const lab = document.createElement("div");
    lab.className = "program-titlelabel";
    lab.textContent = labelText;

    const titlePanel = document.createElement("div");
    titlePanel.className = "program-title";
    titlePanel.textContent = item.title;

    wrap.appendChild(lab);
    wrap.appendChild(titlePanel);
    right.appendChild(wrap);

    const presenterEl = middle.querySelector(".program-presenter");
    presenterEl.addEventListener("click", () => {
        card.classList.toggle("is-revealed");
    });
    }


  // Poster sessions: View 9 posters dropdown
const isPoster1 = normalize(item.name).includes("poster session 1");
const isPoster2 = normalize(item.name).includes("poster session 2");

if (isPoster1 || isPoster2) {
  const which = isPoster1 ? "poster1" : "poster2";
  const posters = (PROGRAM_DATA[which] || []).slice(0, 9);

  const block = document.createElement("div");
  block.className = "poster-block";

  // Left column: label + button stacked
  const leftStack = document.createElement("div");
  leftStack.style.display = "flex";
  leftStack.style.flexDirection = "column";
  leftStack.style.alignItems = "center";   // nicer alignment in the label box
  leftStack.style.gap = "0.55rem";

  const lab = document.createElement("div");
  lab.className = "poster-label";
  lab.textContent = "Poster titles";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "poster-btn";
  btn.innerHTML = `View 9 posters <span class="chev">▾</span>`;

  leftStack.appendChild(lab);
  leftStack.appendChild(btn);

  // Right column: list
  const content = document.createElement("div");
  content.style.display = "flex";
  content.style.flexDirection = "column";
  content.style.alignItems = "flex-start";
  content.style.gap = "0.65rem";

  const list = document.createElement("div");
  list.className = "poster-list";
  list.hidden = true;
  list.innerHTML = `<ol>${posters.map(p => `<li>${p}</li>`).join("")}</ol>`;

  btn.addEventListener("click", () => {
    const willOpen = list.hidden;
    list.hidden = !willOpen;
    card.classList.toggle("is-open", willOpen);
  });

  content.appendChild(list);

  block.appendChild(leftStack);
  block.appendChild(content);
  right.appendChild(block);
}



  row.appendChild(left);
  row.appendChild(middle);
  row.appendChild(right);

  card.appendChild(row);
  return card;
}

function renderSchedule(){
  const rows = PROGRAM_DATA.schedule
    .filter(item => {
      const hay = [item.time, item.name, item.authors, item.title].filter(Boolean).join(" • ");
      return matchesQuery(hay);
    });

  els.panel.innerHTML = "";

  const groupsOrder = ["Morning", "Midday", "Afternoon"];
  const grouped = new Map(groupsOrder.map(g => [g, []]));

  rows.forEach(item => {
    const g = groupForItem(item);
    if(!grouped.has(g)) grouped.set(g, []);
    grouped.get(g).push(item);
  });

  groupsOrder.forEach(groupName => {
    const items = grouped.get(groupName) || [];
    if(items.length === 0) return;

    const section = document.createElement("section");
    section.className = "program-group";

    const hint =
      groupName === "Morning" ? "Keynotes and early sessions"
      : groupName === "Midday" ? "Lunch and mid-day sessions"
      : "Afternoon sessions and closing";

    section.appendChild(makeGroupHeader(groupName, hint));

    const list = document.createElement("div");
    list.className = "program-panel";
    items.forEach(item => list.appendChild(makeScheduleCard(item)));

    section.appendChild(list);
    els.panel.appendChild(section);
  });

  els.empty.hidden = rows.length !== 0;
}

function renderPoster(which){
  const list = PROGRAM_DATA[which];
  const filtered = list.filter(title => matchesQuery(title));

  els.panel.innerHTML = "";

  const section = document.createElement("section");
  section.className = "program-group";
  section.appendChild(makeGroupHeader(
    which === "poster1" ? "Poster Session 1" : "Poster Session 2",
    "Full list"
  ));

  const wrap = document.createElement("div");
  wrap.className = "program-panel";

  filtered.forEach((title, idx) => {
    const card = document.createElement("article");
    card.className = "program-card pattern-a";

    const layer = document.createElement("div");
    layer.className = "pattern-layer";
    card.appendChild(layer);

    card.innerHTML += `
      <div class="program-row" style="grid-template-columns: 210px 1fr;">
        <div class="program-time">
          <div class="program-time__label">Poster</div>
          <div class="program-time__pill">#${String(idx + 1).padStart(2,"0")}</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:.45rem;">
          <span class="program-badge">Poster</span>
          <div style="color: rgba(226,232,240,0.94); font-weight: 600; line-height: 1.42;">
            ${title}
          </div>
        </div>
      </div>
    `;
    wrap.appendChild(card);
  });

  section.appendChild(wrap);
  els.panel.appendChild(section);

  els.empty.hidden = filtered.length !== 0;
}

function render(){
  if(state.tab === "schedule") renderSchedule();
  if(state.tab === "poster1") renderPoster("poster1");
  if(state.tab === "poster2") renderPoster("poster2");
}

// Events
if(els.search){
  els.search.addEventListener("input", (e) => {
    state.q = e.target.value || "";
    render();
  });
}
els.tabs.forEach(btn => btn.addEventListener("click", () => setActiveTab(btn.dataset.tab)));

render();
