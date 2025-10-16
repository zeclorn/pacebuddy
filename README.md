# Pace Buddy

Pace Buddy is a lightweight single-page web app that helps runners convert a race result from meters and minutes/seconds into an average pace per mile. The project is built entirely with static assets, so you can open `index.html` directly in a browser to try it out.

## Features

- **Distance and time inputs** – Enter the race distance in meters and the finishing time in `mm:ss` format. Client-side validation ensures the distance is positive and the seconds are under 60 for reliable calculations.
- **Instant pace calculation** – Submitting the form computes your average pace per mile and displays a short breakdown of the inputs that produced the result.
- **Accessible error handling** – Friendly error messages guide you to fix invalid inputs and are announced via the `aria-live` result container for assistive technologies.
- **Dark and light themes** – Toggle between color themes. The current theme is stored in `localStorage`, so your preference persists between visits.

## How it works

1. The form submits through JavaScript (`script.js`). The handler intercepts the submit event, validates the fields, and parses the time string into total seconds.
2. The distance in meters is converted into miles by dividing by the `METERS_PER_MILE` constant (1,609.34 meters per mile).
3. Total seconds are divided by miles to calculate seconds per mile. The app rounds to the nearest whole second and formats the pace as `M:SS`.
4. The formatted pace and a summary of the input stats are rendered into the result section.
5. Theme toggling swaps the body class between `theme-dark` and `theme-light`, updates the toggle label, and saves the choice to `localStorage` for future visits.

## Project structure

- `index.html` – Markup for the Pace Buddy interface, including the distance/time form, result container, and theme toggle button.
- `styles.css` – Styling for both light and dark themes, including layout, typography, and focus states.
- `script.js` – Client-side logic for input validation, pace calculation, result rendering, and theme persistence.

## Getting started

Because Pace Buddy is a static site, you do not need a build step or dependencies. Open the project folder in your file explorer and double-click `index.html`, or host the folder with any static site server of your choice.

