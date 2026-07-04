const form = document.getElementById("pace-form");
const distanceInput = document.getElementById("distance");
const unitSelect = document.getElementById("distance-unit");
const timeInput = document.getElementById("time");
const resultContainer = document.getElementById("pace-result");
const themeToggle = document.getElementById("theme-toggle");
const distanceGuideToggle = document.getElementById("distance-guide-toggle");
const distanceGuideContent = document.getElementById("distance-guide-content");

const paceUtils = window.PaceBuddy;

const THEME_KEY = "pace-buddy-theme";
const UNIT_KEY = "pace-buddy-unit";
const THEMES = {
  DARK: "theme-dark",
  LIGHT: "theme-light",
};

const readStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Ignore storage errors (e.g., privacy mode)
  }
};

const updateToggleLabel = (theme) => {
  const isDark = theme === THEMES.DARK;
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  themeToggle.setAttribute("aria-pressed", String(isDark));
};

const applyTheme = (theme) => {
  document.body.classList.remove(THEMES.DARK, THEMES.LIGHT);
  document.body.classList.add(theme);
  updateToggleLabel(theme);
};

const initializeTheme = () => {
  const storedTheme = readStorage(THEME_KEY);
  if ([THEMES.DARK, THEMES.LIGHT].includes(storedTheme)) {
    applyTheme(storedTheme);
    return;
  }

  const prefersLight =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(prefersLight ? THEMES.LIGHT : THEMES.DARK);
};

initializeTheme();

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains(THEMES.DARK)
    ? THEMES.LIGHT
    : THEMES.DARK;
  applyTheme(nextTheme);
  writeStorage(THEME_KEY, nextTheme);
});

const setGuideVisibility = (isVisible) => {
  distanceGuideContent.hidden = !isVisible;
  distanceGuideToggle.setAttribute("aria-expanded", String(isVisible));
  distanceGuideToggle.textContent = isVisible
    ? "Hide Distance Reference"
    : "Quick Distance Reference";
};

setGuideVisibility(false);

distanceGuideToggle.addEventListener("click", () => {
  setGuideVisibility(distanceGuideContent.hidden);
});

const initializeUnit = () => {
  const storedUnit = readStorage(UNIT_KEY);
  if (storedUnit && paceUtils && paceUtils.DISTANCE_UNITS[storedUnit]) {
    unitSelect.value = storedUnit;
  }
};

initializeUnit();

const normalizeTimeInput = () => {
  if (!paceUtils) {
    return timeInput.value;
  }
  const formatted = paceUtils.formatCompactTime(timeInput.value);
  if (formatted !== timeInput.value) {
    timeInput.value = formatted;
  }
  return formatted;
};

const clearResult = () => {
  resultContainer.replaceChildren();
};

const describeRun = (result) => {
  const meters = Math.round(result.distanceMeters).toLocaleString();
  const miles = result.miles.toFixed(2);
  const km = result.km.toFixed(2);
  const time = paceUtils.formatTime(result.totalSeconds);
  return `${meters} meters (${miles} mi / ${km} km) in ${time}.`;
};

const showPace = (result) => {
  const milePace = document.createElement("div");
  milePace.className = "pace-result__value";
  milePace.textContent = `${result.pacePerMile} / mile`;

  const kmPace = document.createElement("div");
  kmPace.className = "pace-result__value pace-result__value--secondary";
  kmPace.textContent = `${result.pacePerKm} / km`;

  const meta = document.createElement("p");
  meta.className = "pace-result__meta";
  meta.textContent = describeRun(result);

  resultContainer.replaceChildren(milePace, kmPace, meta);
};

const showError = (message) => {
  const error = document.createElement("div");
  error.className = "pace-result__error";
  error.textContent = message;
  resultContainer.replaceChildren(error);
};

const updateLiveResult = () => {
  if (!paceUtils) {
    return;
  }

  if (!distanceInput.value.trim() || !timeInput.value.trim()) {
    clearResult();
    return;
  }

  const result = paceUtils.calculatePace(
    distanceInput.value,
    timeInput.value,
    unitSelect.value
  );

  if (result.error) {
    // Stay quiet while the user is still typing; submit surfaces errors.
    clearResult();
    return;
  }

  showPace(result);
};

distanceInput.addEventListener("input", updateLiveResult);
timeInput.addEventListener("input", updateLiveResult);

timeInput.addEventListener("blur", () => {
  normalizeTimeInput();
  updateLiveResult();
});

unitSelect.addEventListener("change", () => {
  writeStorage(UNIT_KEY, unitSelect.value);
  updateLiveResult();
});

const fillDistance = (meters, row) => {
  unitSelect.value = "meters";
  writeStorage(UNIT_KEY, "meters");
  distanceInput.value = meters;
  updateLiveResult();

  row.classList.add("distance-guide__row--selected");
  setTimeout(() => {
    row.classList.remove("distance-guide__row--selected");
  }, 700);
};

document
  .querySelectorAll(".distance-guide__table tbody tr")
  .forEach((row) => {
    const button = row.querySelector(".distance-guide__fill");
    if (!button) return;

    button.addEventListener("click", () => {
      fillDistance(button.dataset.meters, row);
    });

    row.addEventListener("click", (event) => {
      if (event.target !== button) {
        button.click();
      }
    });
  });

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!paceUtils) {
    showError(
      "Pace calculations are unavailable right now. Please try again later."
    );
    return;
  }

  const result = paceUtils.calculatePace(
    distanceInput.value,
    normalizeTimeInput(),
    unitSelect.value
  );

  if (result.error) {
    showError(result.error);
    return;
  }

  showPace(result);
});
