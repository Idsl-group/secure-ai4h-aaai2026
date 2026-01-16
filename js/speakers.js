// Speakers directory (search + filter + modal) — no external libraries

const SPEAKERS = [
  {
    "Name": "Jie Sun",
    "Affiliation": "Cofounder & CEO, ChemT Biotechnology",
    "Email": "jie.sun@chemtbio.com",
    "Website": null,
    "Role": "Invited Speaker",
    "Title": "AI for virtual cells for pharma manufacturing",
    "Abstract": "Virtual cells are decision-support systems: they propose interventions, so uncertainty and guardrails are mandatory. We treat every recommendation as: prediction + calibrated confidence + domain-of-applicability + testable mechanism.\nRobustness is the core challenge: donor/protocol/clone shift is the norm, not the exception.\nClosed-loop validation is the safety backbone"
  },
  {
    "Name": "Catherine Fang",
    "Affiliation": "Professor at CMU",
    "Email": "catherine.fang@sv.cmu.edu",
    "Website": null,
    "Role": "Keynote",
    "Title": "Responsible AI in AgeTech and Neuroscience",
    "Abstract": "This speech explores the ethical AI in AgeTech and neuroscience. Drawing from our AI lab experimentation, award-winning EEG-based therapeutic platform and CES 2026 insights, Dr. Fang will showcase how AI models can interpret neural and biometric data to enable personalized and adaptive care. The session will highlight pathways for translating academic research into deployable health technologies and invite collaboration on co-developing responsible AI solutions in biomedicine and healthcare."
  },
  {
    "Name": "W. John Braun & Kyeongah Nah",
    "Affiliation": "UBC and National Institute for Mathematical Sciences, Korea",
    "Email": "john.braun@ubc.ca",
    "Website": null,
    "Role": null,
    "Title": "AI, the SIR Model, and DE-Constrained Kernel Smoothing",
    "Abstract": "We consider curve-fitting problems for noisy data coming from a\ngenerating process governed by differential equations. Bias can be\nreduced in nonparametric curve estimates by using the differential\nequations as constraints.  Repeated differentiations are required\nand a number of tuning parameters must be set.  We show how Large\nLanguage Models can be used to assist in these computations.   The\ntechnique is illustrated on simulated data generated from a stochastic\nSusceptible-Infected-Recovered (SIR) model and applied to influenza-like\nillness data.  In the latter case, the technique demonstrates how to\ndetect departures from the SIR model."
  },
  {
    "Name": "Amitava Da",
    "Affiliation": "Professor: CS, BITS Goa, Adjunct AIISC, USA,",
    "Email": "amitava.santu@gmail.com",
    "Website": "https://pragyaai.github.io/",
    "Role": null,
    "Title": "MedLLM Safety Pathology: Breaking—and Fixing—Clinical LLMs Against Adversarial Prompts, Alignment Drift, Retrieval Poisoning, and Permafrost Attacks",
    "Abstract": "With the power of foundation models, healthcare—like every other field—has begun to transcend its traditional limits. But the familiar quote, “with great power comes great responsibility,” is not a slogan here; it is a community-level commitment we must take seriously. In clinical settings, the cost of error is not inconvenience—it is patient harm, mis-triage, and erosion of trust. That raises the bar: MedLLMs must be evaluated not only for capability, but also for robustness to adversaries, stability under updates, and integrity of their evidence pipelines."
  }
];

const els = {
  grid: document.getElementById("spGrid"),
  empty: document.getElementById("spEmpty"),
  search: document.getElementById("spSearch"),
  pills: Array.from(document.querySelectorAll(".speakers-pill")),
  count: document.getElementById("spCount"),

  modal: document.getElementById("spModal"),
  modalAvatar: document.getElementById("spModalAvatar"),
  modalRole: document.getElementById("spModalRole"),
  modalName: document.getElementById("spModalName"),
  modalAffil: document.getElementById("spModalAffil"),
  modalTalkTitle: document.getElementById("spModalTalkTitle"),
  modalAbstract: document.getElementById("spModalAbstract"),
  modalEmail: document.getElementById("spModalEmail"),
  modalWebsite: document.getElementById("spModalWebsite"),
};

let activeRole = "All";
let query = "";

function normalizeRole(role) {
  const r = (role || "").trim();
  if (!r) return "Other";
  const low = r.toLowerCase();
  if (low.includes("keynote")) return "Keynote";
  if (low.includes("invited")) return "Invited Speaker";
  return "Other";
}

function initials(name) {
  const clean = (name || "").replace(/\s+/g, " ").trim();
  if (!clean) return "SP";
  const parts = clean.split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function matches(s) {
  const role = normalizeRole(s.Role);
  const roleOk =
    activeRole === "All" ||
    (activeRole === "Other" ? role === "Other" : role === activeRole);

  if (!roleOk) return false;

  const q = query.trim().toLowerCase();
  if (!q) return true;

  const hay = `${s.Name || ""} ${s.Affiliation || ""} ${s.Title || ""} ${s.Role || ""}`.toLowerCase();
  return hay.includes(q);
}

function render() {
  const list = SPEAKERS
    .map(s => ({ ...s, _role: normalizeRole(s.Role) }))
    .filter(matches);

  els.grid.innerHTML = list.map((s, i) => `
    <article class="speaker-card" tabindex="0" role="button"
      aria-label="Open details for ${esc(s.Name)}" data-i="${i}">
      <div class="speaker-top">
        <div class="speakers-avatar" aria-hidden="true">${esc(initials(s.Name))}</div>
        <div style="min-width:0">
          <p class="speakers-role">${esc(s._role)}</p>
          <h3 class="speakers-name">${esc(s.Name || "Speaker")}</h3>
          <p class="speakers-affil">${esc(s.Affiliation || "")}</p>
        </div>
      </div>

      <div class="speaker-talk">
        <p class="speakers-talkTitle">${esc(s.Title || "")}</p>
      </div>
    </article>
  `).join("");

  els.empty.hidden = list.length !== 0;
  els.count.textContent = `${list.length} speaker${list.length === 1 ? "" : "s"}`;

  // Click / keyboard open
  els.grid.querySelectorAll(".speaker-card").forEach(card => {
    const idx = Number(card.dataset.i);
    const data = list[idx];

    card.addEventListener("click", () => openModal(data));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(data);
      }
    });
  });
}

function openModal(s) {
  const role = normalizeRole(s.Role);

  els.modalAvatar.textContent = initials(s.Name);
  els.modalRole.textContent = role;
  els.modalName.textContent = s.Name || "Speaker";
  els.modalAffil.textContent = s.Affiliation || "";
  els.modalTalkTitle.textContent = s.Title || "";
  els.modalAbstract.textContent = s.Abstract || "";

  if (s.Email && String(s.Email).trim()) {
    els.modalEmail.href = `mailto:${s.Email}`;
    els.modalEmail.style.display = "";
  } else {
    els.modalEmail.style.display = "none";
  }

  if (s.Website && String(s.Website).trim()) {
    els.modalWebsite.href = s.Website;
    els.modalWebsite.hidden = false;
  } else {
    els.modalWebsite.hidden = true;
  }

  els.modal.classList.add("is-open");
  els.modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  els.modal.classList.remove("is-open");
  els.modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setActive(btn) {
  els.pills.forEach(p => p.classList.remove("is-active"));
  btn.classList.add("is-active");
  activeRole = btn.dataset.role;
  render();
}

els.pills.forEach(btn => btn.addEventListener("click", () => setActive(btn)));

els.search.addEventListener("input", (e) => {
  query = e.target.value || "";
  render();
});

els.modal.addEventListener("click", (e) => {
  if (e.target?.dataset?.close === "true") closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && els.modal.classList.contains("is-open")) closeModal();
});

render();
