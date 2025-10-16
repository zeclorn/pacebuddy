const doc = typeof document !== "undefined" ? document : null;
const form = doc ? doc.getElementById("pace-form") : null;
const distanceInput = doc ? doc.getElementById("distance") : null;
const timeInput = doc ? doc.getElementById("time") : null;
const resultContainer = doc ? doc.getElementById("pace-result") : null;
const themeToggle = doc ? doc.getElementById("theme-toggle") : null;
const body = doc ? doc.body : null;
const distanceGuideToggle = doc
  ? doc.getElementById("distance-guide-toggle")
  : null;
const distanceGuideContent = doc
  ? doc.getElementById("distance-guide-content")
  : null;

const THEME_KEY = "pace-buddy-theme";
const THEMES = {
  DARK: "theme-dark",
  LIGHT: "theme-light",
};

const paceUtils =
  (typeof window !== "undefined" && window.PaceBuddy) || undefined;

const calculatePace = paceUtils ? paceUtils.calculatePace : undefined;

const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (error) {
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // Ignore storage errors (e.g., privacy mode)
  }
};

const updateToggleLabel = (theme) => {
  if (!themeToggle) return;
  const isDark = theme === THEMES.DARK;
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  themeToggle.setAttribute("aria-pressed", String(isDark));
};

const applyTheme = (theme) => {
  if (!body) return;
  body.classList.remove(THEMES.DARK, THEMES.LIGHT);
  body.classList.add(theme);
  updateToggleLabel(theme);
};

const initializeTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme && [THEMES.DARK, THEMES.LIGHT].includes(storedTheme)) {
    applyTheme(storedTheme);
  } else {
    applyTheme(THEMES.DARK);
  }
};

if (themeToggle) {
  initializeTheme();

  themeToggle.addEventListener("click", () => {
    if (!body) return;
    const nextTheme = body.classList.contains(THEMES.DARK)
      ? THEMES.LIGHT
      : THEMES.DARK;
    applyTheme(nextTheme);
    storeTheme(nextTheme);
  });
} else {
  applyTheme(THEMES.DARK);
}

const setGuideVisibility = (isVisible) => {
  if (!distanceGuideToggle || !distanceGuideContent) {
    return;
  }

  distanceGuideContent.hidden = !isVisible;
  distanceGuideToggle.setAttribute("aria-expanded", String(isVisible));
  distanceGuideToggle.textContent = isVisible
    ? "Hide Distance Reference"
    : "Quick Distance Reference";
};

if (distanceGuideToggle && distanceGuideContent) {
  setGuideVisibility(false);

  distanceGuideToggle.addEventListener("click", () => {
    const willShow = distanceGuideContent.hidden;
    setGuideVisibility(willShow);
  });
}

const COMPACT_TIME_PATTERN = /^\d+$/;

const formatCompactTime = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.includes(":")) {
    return trimmed;
  }

  if (!COMPACT_TIME_PATTERN.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.length <= 2) {
    return trimmed;
  }

  if (trimmed.length <= 4) {
    const minutesPart = trimmed.slice(0, -2);
    const secondsPart = trimmed.slice(-2);
    const minutes = String(Number(minutesPart));
    const seconds = secondsPart.padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  if (trimmed.length <= 6) {
    const hoursPart = trimmed.slice(0, -4);
    const minutesPart = trimmed.slice(-4, -2);
    const secondsPart = trimmed.slice(-2);
    const hours = String(Number(hoursPart));
    const minutes = minutesPart.padStart(2, "0");
    const seconds = secondsPart.padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  return trimmed;
};

const normalizeTimeInput = () => {
  if (!timeInput) return "";
  const formatted = formatCompactTime(timeInput.value);
  if (formatted !== timeInput.value) {
    timeInput.value = formatted;
  }
  return formatted;
};

if (timeInput) {
  timeInput.addEventListener("blur", normalizeTimeInput);
}

const renderResult = (content) => {
  if (!resultContainer) return;
  resultContainer.innerHTML = "";
  resultContainer.appendChild(content);
};

const showPace = (pace, stats) => {
  if (!doc) return;
  const paceValue = doc.createElement("div");
  paceValue.className = "pace-result__value";
  paceValue.textContent = `${pace} / mile`;

  const meta = doc.createElement("p");
  meta.className = "pace-result__meta";
  meta.innerHTML = stats;

  const fragment = doc.createDocumentFragment();
  fragment.appendChild(paceValue);
  fragment.appendChild(meta);

  renderResult(fragment);
};

const showError = (message) => {
  if (!doc) return;
  const error = doc.createElement("div");
  error.className = "pace-result__error";
  error.textContent = message;
  renderResult(error);
};

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (typeof calculatePace !== "function") {
      showError(
        "Pace calculations are unavailable right now. Please try again later."
      );
      return;
    }

    const distance = distanceInput.value;
    const timeValue = normalizeTimeInput();
    const result = calculatePace(distance, timeValue);

    if (result.error) {
      showError(result.error);
      return;
    }

    showPace(result.pace, result.stats);
  });
}

if (typeof module === "object" && module.exports) {
  module.exports = {
    formatCompactTime,
  };
}
