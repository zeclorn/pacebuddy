# Pace Buddy

Pace Buddy is a lightweight single-page web app that helps runners convert a race result into an average pace per mile and per kilometer. The project is built entirely with static assets — no build step, no dependencies — so you can open `index.html` directly in a browser or host the folder on any static host (the live site runs on Cloudflare Pages).

## Features

- **Flexible distance input** – Enter distance in meters, kilometers, or miles. Your unit choice is remembered between visits.
- **Flexible time parsing** – Enter your finish time as `ss`, `mm:ss`, or `hh:mm:ss`. Bare seconds can exceed 60 (handy for track intervals), while minutes and seconds in the longer formats are validated to stay below 60.
- **Compact time auto-formatting** – Typing a continuous string of digits (for example `1234`) automatically reformats to a readable `12:34` when the input loses focus.
- **Live results** – The pace updates as you type once both fields are valid; the Calculate button still works and surfaces validation errors.
- **Dual-unit pace** – Results show both min/mile and min/km, plus a summary of the distance and time that produced them.
- **Quick distance reference** – A collapsible table of common race distances; click any row to fill the distance into the calculator.
- **Dark and light themes** – The first visit follows your operating system's color-scheme preference; the toggle overrides it and the choice persists in `localStorage`.
- **Accessible** – Errors and results are announced via an `aria-live` region, and all controls are keyboard-operable.

## Project structure

- `index.html` – Markup for the interface: distance/time form with unit select, quick distance reference table, result container, and theme toggle.
- `styles.css` – Styling for both themes, including layout, typography, and focus states.
- `pace-utils.js` – Pure logic helpers (time parsing, distance conversion, pace calculation, formatting). Consumed by both the UI and the tests; no DOM access.
- `script.js` – Browser-only UI logic: event wiring, result rendering, theme and unit persistence.
- `tests/` – `node:test`-based unit tests for the helpers.

## Running the tests

```bash
npm test
```

No install step is needed — the tests use Node's built-in `node:test` runner (Node 18+). A GitHub Actions workflow runs them on every push and pull request.

## Getting started

Because Pace Buddy is a static site, there is no build step or runtime dependency. Open `index.html` directly in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server
```
