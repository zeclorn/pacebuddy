const form = document.getElementById("pace-form");
const distanceInput = document.getElementById("distance");
const timeInput = document.getElementById("time");
const resultContainer = document.getElementById("pace-result");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

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
    const nextTheme = body.classList.contains(THEMES.DARK)
      ? THEMES.LIGHT
      : THEMES.DARK;
    applyTheme(nextTheme);
    storeTheme(nextTheme);
  });
} else {
  applyTheme(THEMES.DARK);
}

const renderResult = (content) => {
  resultContainer.innerHTML = "";
  resultContainer.appendChild(content);
};

const showPace = (pace, stats) => {
  const paceValue = document.createElement("div");
  paceValue.className = "pace-result__value";
  paceValue.textContent = `${pace} / mile`;

  const meta = document.createElement("p");
  meta.className = "pace-result__meta";
  meta.innerHTML = stats;

  const fragment = document.createDocumentFragment();
  fragment.appendChild(paceValue);
  fragment.appendChild(meta);

  renderResult(fragment);
};

const showError = (message) => {
  const error = document.createElement("div");
  error.className = "pace-result__error";
  error.textContent = message;
  renderResult(error);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (typeof calculatePace !== "function") {
    showError("Pace calculations are unavailable right now. Please try again later.");
    return;
  }

  const distance = distanceInput.value;
  const timeValue = timeInput.value;
  const result = calculatePace(distance, timeValue);

  if (result.error) {
    showError(result.error);
    return;
  }

  showPace(result.pace, result.stats);
});
