(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PaceBuddy = factory();
  }
})(
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
    ? self
    : this,
  () => {
    const METERS_PER_MILE = 1609.344;
    const METERS_PER_KM = 1000;

    const DISTANCE_UNITS = {
      meters: 1,
      km: METERS_PER_KM,
      miles: METERS_PER_MILE,
    };

    const DIGITS_ONLY = /^\d+$/;

    const formatTime = (totalSeconds) => {
      const rounded = Math.round(totalSeconds);
      const hours = Math.floor(rounded / 3600);
      const minutes = Math.floor((rounded % 3600) / 60);
      const seconds = rounded % 60;
      const paddedSeconds = String(seconds).padStart(2, "0");
      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${paddedSeconds}`;
      }
      return `${minutes}:${paddedSeconds}`;
    };

    const formatPace = formatTime;

    const parseTime = (value) => {
      if (typeof value !== "string") {
        return null;
      }

      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }

      const segments = trimmed.split(":");
      if (segments.some((segment) => !DIGITS_ONLY.test(segment))) {
        return null;
      }

      const numbers = segments.map(Number);

      if (numbers.length === 1) {
        return numbers[0];
      }

      if (numbers.length === 2) {
        const [minutes, seconds] = numbers;
        if (seconds >= 60) {
          return null;
        }
        return minutes * 60 + seconds;
      }

      if (numbers.length === 3) {
        const [hours, minutes, seconds] = numbers;
        if (minutes >= 60 || seconds >= 60) {
          return null;
        }
        return hours * 3600 + minutes * 60 + seconds;
      }

      return null;
    };

    const parseDistance = (value, unit = "meters") => {
      const factor = DISTANCE_UNITS[unit];
      if (!factor) {
        return null;
      }

      const amount =
        typeof value === "string" ? Number(value.trim() || NaN) : Number(value);
      if (!Number.isFinite(amount) || amount <= 0) {
        return null;
      }

      return amount * factor;
    };

    const formatCompactTime = (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim();
      if (!trimmed || trimmed.includes(":") || !DIGITS_ONLY.test(trimmed)) {
        return trimmed;
      }

      if (trimmed.length <= 2) {
        return trimmed;
      }

      if (trimmed.length <= 4) {
        const minutes = Number(trimmed.slice(0, -2));
        const seconds = trimmed.slice(-2);
        if (Number(seconds) >= 60) {
          return trimmed;
        }
        return `${minutes}:${seconds}`;
      }

      if (trimmed.length <= 6) {
        const hours = Number(trimmed.slice(0, -4));
        const minutes = trimmed.slice(-4, -2);
        const seconds = trimmed.slice(-2);
        if (Number(minutes) >= 60 || Number(seconds) >= 60) {
          return trimmed;
        }
        return `${hours}:${minutes}:${seconds}`;
      }

      return trimmed;
    };

    const calculatePace = (distanceValue, timeValue, unit = "meters") => {
      const distanceMeters = parseDistance(distanceValue, unit);
      if (distanceMeters === null) {
        return {
          error: "Please enter a distance greater than 0.",
        };
      }

      const totalSeconds = parseTime(timeValue);
      if (totalSeconds === null || totalSeconds <= 0) {
        return {
          error:
            "Please enter a valid time in the format ss, mm:ss, or hh:mm:ss.",
        };
      }

      const miles = distanceMeters / METERS_PER_MILE;
      const km = distanceMeters / METERS_PER_KM;
      const secondsPerMile = totalSeconds / miles;
      const secondsPerKm = totalSeconds / km;

      return {
        distanceMeters,
        miles,
        km,
        totalSeconds,
        secondsPerMile,
        secondsPerKm,
        pacePerMile: formatPace(secondsPerMile),
        pacePerKm: formatPace(secondsPerKm),
      };
    };

    return {
      METERS_PER_MILE,
      METERS_PER_KM,
      DISTANCE_UNITS,
      formatTime,
      formatPace,
      parseTime,
      parseDistance,
      formatCompactTime,
      calculatePace,
    };
  }
);
