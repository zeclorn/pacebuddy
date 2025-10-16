# Pace Buddy

Pace Buddy is a lightweight single-page web app that helps runners convert a race result from meters and minutes/seconds into an average pace per mile. The project is built entirely with static assets, so you can open `index.html` directly in a browser to try it out.

## Features

- **Flexible time parsing** – Enter your finish time as `ss`, `mm:ss`, or `hh:mm:ss`. The parser validates that minutes and seconds stay below 60 and rejects invalid entries with clear feedback.
- **Compact time auto-formatting** – Typing a continuous string of digits (for example `1234`) automatically reformats to a readable `12:34` style when the input loses focus, saving a few keystrokes on mobile.
- **Instant pace calculation** – Submitting the form computes your average pace per mile, rounds to the nearest second, and displays a helpful breakdown of the inputs that produced the result.
- **Accessible error handling** – Friendly error messages guide you to fix invalid inputs and are announced via the `aria-live` result container for assistive technologies.
- **Dark and light themes** – Toggle between color themes. The current theme is stored in `localStorage`, so your preference persists between visits.
- **Offline-friendly** – Everything runs in the browser with no network calls or backend dependencies.

## How it works

1. The form submits through JavaScript (`script.js`). The handler intercepts the submit event, validates the fields, normalizes the time input (including compact digit entries), and parses the string into total seconds.
2. The distance in meters is converted into miles by dividing by the `METERS_PER_MILE` constant (1,609.34 meters per mile).
3. Total seconds are divided by miles to calculate seconds per mile. The app rounds to the nearest whole second and formats the pace as `M:SS`.
4. The formatted pace and a summary of the input stats are rendered into the result section.
5. Theme toggling swaps the body class between `theme-dark` and `theme-light`, updates the toggle label, and saves the choice to `localStorage` for future visits.

## Project structure

- `index.html` – Markup for the Pace Buddy interface, including the distance/time form, result container, and theme toggle button.
- `styles.css` – Styling for both light and dark themes, including layout, typography, and focus states.
- `pace-utils.js` – Standalone helpers for time parsing, pace calculation, and formatting. It is consumed by both the UI and the automated tests.
- `script.js` – Client-side logic for input validation, pace calculation, result rendering, theme persistence, and compact time formatting.
- `tests/` – Node-based smoke tests that exercise the calculation helpers and compact time formatter.

## Running the tests

```bash
npm install
npm test
```

The `test` script runs both helper-based smoke tests to confirm pace calculations work for multiple time formats and that compact time strings format correctly.

## Getting started

Because Pace Buddy is a static site, you do not need a build step or runtime dependencies. Open the project folder in your file explorer and double-click `index.html`, or host the folder with any static site server of your choice.
