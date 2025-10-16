const form = document.getElementById("pace-form");
const distanceInput = document.getElementById("distance");
const timeInput = document.getElementById("time");
const resultContainer = document.getElementById("pace-result");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

const METERS_PER_MILE = 1609.34;
const THEME_KEY = "pace-buddy-theme";
const THEMES = {
  DARK: "theme-dark",
  LIGHT: "theme-light",
};

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

const formatPace = (secondsPerMile) => {
  const totalSeconds = Math.round(secondsPerMile);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

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

const parseTime = (value) => {
  const [minutes, seconds] = value.split(":").map(Number);
  if (Number.isNaN(minutes) || Number.isNaN(seconds)) {
    return null;
  }
  if (seconds >= 60) {
    return null;
  }
  return minutes * 60 + seconds;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const distance = Number(distanceInput.value);
  const timeValue = timeInput.value.trim();
  const totalSeconds = parseTime(timeValue);

  if (!Number.isFinite(distance) || distance <= 0) {
    showError("Please enter a distance greater than 0 meters.");
    return;
  }

  if (totalSeconds === null || totalSeconds <= 0) {
    showError("Please enter a valid time in the format mm:ss (seconds under 60).");
    return;
  }

  const miles = distance / METERS_PER_MILE;
  if (miles === 0) {
    showError("Distance must convert to at least a fraction of a mile.");
    return;
  }

  const secondsPerMile = totalSeconds / miles;
  const formattedPace = formatPace(secondsPerMile);

  const stats = `Based on ${distance.toLocaleString()} meters in ${timeValue}, you ran ${miles.toFixed(2)} miles.`;

  showPace(formattedPace, stats);
});
