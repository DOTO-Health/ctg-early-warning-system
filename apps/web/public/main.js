// Ctg-Early-Warning-System web UI — plain HTML + Tailwind v4, no build framework needed.
// Talks to the NestJS API over REST; see README.md for the endpoint list.

const params = new URLSearchParams(window.location.search);

const API_BASE = window.CTG_API_BASE || "http://localhost:3000/api";
const ORG_SLUG = params.get("org") || "default";

/** guidelineId -> ordered list of categories (index order = severity, best -> worst) */
let guidelineMeta = {};

// ---------------------------------------------------------------------------
// Branding: fetch this org/partner's theme and apply it as CSS custom
// properties so the same compiled Tailwind bundle serves every tenant.
// ---------------------------------------------------------------------------
async function applyBranding() {
  try {
    const res = await fetch(`${API_BASE}/branding/${ORG_SLUG}`);
    if (!res.ok) return;
    const brand = await res.json();

    document.documentElement.style.setProperty(
      "--brand-primary",
      brand.primaryColor,
    );
    document.documentElement.style.setProperty(
      "--brand-accent",
      brand.accentColor,
    );

    const SWAGGER_URL = `${API_BASE}/docs`;

    document.getElementById("swagger-link").href = SWAGGER_URL;

    const orgNameEl = document.getElementById("org-name");
    if (orgNameEl) orgNameEl.textContent = brand.organizationName;
    if (brand.logoUrl) {
      const logo = document.getElementById("org-logo");
      logo.src = brand.logoUrl;
      logo.classList.remove("hidden");
    }
  } catch {
    // Branding is a progressive enhancement — fall back silently to the
    // default theme baked into input.css if the API is unreachable.
  }
}

// ---------------------------------------------------------------------------
// API health indicator
// ---------------------------------------------------------------------------
async function checkApiHealth() {
  const dot = document.getElementById("api-status-dot");
  const text = document.getElementById("api-status-text");
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error("not ok");
    dot.className = "h-2 w-2 rounded-full bg-emerald-400";
    text.textContent = "API connected";
  } catch {
    dot.className = "h-2 w-2 rounded-full bg-red-400";
    text.textContent = "API unreachable";
  }
}

// ---------------------------------------------------------------------------
// Guideline metadata (category order -> severity -> badge color)
// ---------------------------------------------------------------------------
async function loadGuidelineMeta() {
  try {
    const res = await fetch(`${API_BASE}/classification/guidelines`);
    const guidelines = await res.json();
    guidelineMeta = Object.fromEntries(guidelines.map((g) => [g.id, g]));
  } catch {
    guidelineMeta = {};
  }
}

function severityClasses(guidelineId, category) {
  const categories = guidelineMeta[guidelineId]?.categories ?? [];
  const index = categories.indexOf(category);

  if (index === 0) {
    return "bg-[var(--color-status-good-bg)] text-[var(--color-status-good)]";
  }
  if (index === categories.length - 1 && categories.length > 1) {
    return "bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger)]";
  }
  return "bg-[var(--color-status-caution-bg)] text-[var(--color-status-caution)]";
}

// ---------------------------------------------------------------------------
// Form -> feature payload
// ---------------------------------------------------------------------------
function readFeaturesFromForm(form) {
  const data = new FormData(form);
  const numberField = (name) => Number(data.get(name));

  return {
    baseline: numberField("baseline"),
    variability: numberField("variability"),
    accelerationCount: numberField("accelerationCount"),
    lateDecelCount: numberField("lateDecelCount"),
    earlyDecelCount: numberField("earlyDecelCount"),
    variableDecelCount: numberField("variableDecelCount"),
    prolongedDecelCount: numberField("prolongedDecelCount"),
    totalDecelCount: numberField("totalDecelCount"),
    repetitiveVariable: data.get("repetitiveVariable") === "on",
    contractionsPer10Min: numberField("contractionsPer10Min"),
  };
}

// ---------------------------------------------------------------------------
// Results rendering
// ---------------------------------------------------------------------------
function renderResults(results) {
  const grid = document.getElementById("results-grid");
  const template = document.getElementById("result-card-template");
  grid.innerHTML = "";

  const guidelineIds = ["FIGO", "NICE", "ACOG"];
  guidelineIds.forEach((id, i) => {
    const card = template.content.cloneNode(true);
    card.querySelector(".guideline-label").textContent =
      guidelineMeta[id]?.label ?? id;
    card.querySelector(".guideline-version").textContent =
      `v${results.versions?.[i] ?? "—"}`;

    const badge = card.querySelector(".status-badge");
    const category = results[id];
    badge.textContent = category;
    badge.className = `status-badge inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${severityClasses(id, category)}`;

    grid.appendChild(card);
  });

  document.getElementById("last-run-at").textContent =
    `classified ${new Date().toLocaleTimeString()}`;
}

function showFormError(message) {
  const el = document.getElementById("form-error");
  if (!message) {
    el.classList.add("hidden");
    el.textContent = "";
    return;
  }
  el.textContent = message;
  el.classList.remove("hidden");
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------
async function classifyCurrentForm() {
  const form = document.getElementById("ctg-form");
  const features = readFeaturesFromForm(form);

  const res = await fetch(`${API_BASE}/classification/all`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(features),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.message?.join?.(", ") || body.message || "Classification failed",
    );
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Audit trail (traces)
// ---------------------------------------------------------------------------
async function loadTraces() {
  const list = document.getElementById("traces-list");
  try {
    const res = await fetch(`${API_BASE}/traces`);
    const traces = await res.json();

    if (!traces.length) {
      list.innerHTML =
        '<li class="px-5 py-4 text-slate-400">No traces saved yet this session.</li>';
      return;
    }

    list.innerHTML = traces
      .slice(0, 10)
      .map(
        (t) => `
        <li class="px-5 py-3 flex items-center justify-between">
          <div>
            <p class="font-medium">${t.label || "Untitled trace"}</p>
            <p class="text-xs text-slate-400 font-[family-name:var(--font-data)]">${new Date(t.createdAt).toLocaleString()}</p>
          </div>
          <div class="flex gap-1.5 text-xs font-[family-name:var(--font-data)]">
            <span class="px-2 py-0.5 rounded ${severityClasses("FIGO", t.results.FIGO)}">${t.results.FIGO}</span>
            <span class="px-2 py-0.5 rounded ${severityClasses("NICE", t.results.NICE)}">${t.results.NICE}</span>
            <span class="px-2 py-0.5 rounded ${severityClasses("ACOG", t.results.ACOG)}">${t.results.ACOG}</span>
          </div>
        </li>`,
      )
      .join("");
  } catch {
    list.innerHTML =
      '<li class="px-5 py-4 text-[var(--color-status-danger)]">Could not load traces.</li>';
  }
}

async function saveCurrentTrace() {
  const form = document.getElementById("ctg-form");
  const features = readFeaturesFromForm(form);
  const label = new FormData(form).get("label") || undefined;

  const res = await fetch(`${API_BASE}/traces`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({label, features}),
  });

  if (!res.ok) throw new Error("Could not save trace");
  await loadTraces();
}

// ---------------------------------------------------------------------------
// Wiring
// ---------------------------------------------------------------------------
document.getElementById("ctg-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  showFormError(null);
  try {
    const results = await classifyCurrentForm();
    renderResults(results);
  } catch (err) {
    showFormError(err.message);
  }
});

document
  .getElementById("save-trace-btn")
  .addEventListener("click", async () => {
    showFormError(null);
    try {
      await saveCurrentTrace();
    } catch (err) {
      showFormError(err.message);
    }
  });

document.getElementById("refresh-traces").addEventListener("click", loadTraces);

document.getElementById("clear-traces").addEventListener("click", async () => {
  try {
    await fetch(`${API_BASE}/traces`, {method: "DELETE"});
    await loadTraces();
  } catch {
    // best-effort — traces list will just stay as-is if this fails
  }
});

(async function init() {
  await Promise.all([applyBranding(), checkApiHealth(), loadGuidelineMeta()]);
  await loadTraces();
})();
