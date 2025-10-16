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
    const METERS_PER_MILE = 1609.34;

    const formatPace = (secondsPerMile) => {
      const totalSeconds = Math.round(secondsPerMile);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const parseTime = (value) => {
      if (typeof value !== "string") {
        return null;
      }

      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }

      const segments = trimmed.split(":").map((segment) => Number(segment));
      if (segments.some((segment) => Number.isNaN(segment))) {
        return null;
      }

      if (segments.length === 2) {
        const [minutes, seconds] = segments;
        if (seconds >= 60 || minutes < 0 || seconds < 0) {
          return null;
        }
        return minutes * 60 + seconds;
      }

      if (segments.length === 3) {
        const [hours, minutes, seconds] = segments;
        if (
          hours < 0 ||
          minutes < 0 ||
          seconds < 0 ||
          minutes >= 60 ||
          seconds >= 60
        ) {
          return null;
        }
        return hours * 3600 + minutes * 60 + seconds;
      }

      return null;
    };

    const calculatePace = (distanceMeters, timeValue) => {
      const distance = Number(distanceMeters);
      if (!Number.isFinite(distance) || distance <= 0) {
        return {
          error: "Please enter a distance greater than 0 meters.",
        };
      }

      const totalSeconds = parseTime(timeValue);
      if (totalSeconds === null || totalSeconds <= 0) {
        return {
          error:
            "Please enter a valid time in the format mm:ss or hh:mm:ss with seconds under 60.",
        };
      }

      const normalizedTime =
        typeof timeValue === "string" && timeValue.trim()
          ? timeValue.trim()
          : typeof timeValue === "string"
          ? timeValue
          : String(timeValue ?? "");

      const miles = distance / METERS_PER_MILE;
      if (!Number.isFinite(miles) || miles <= 0) {
        return {
          error: "Distance must convert to at least a fraction of a mile.",
        };
      }

      const secondsPerMile = totalSeconds / miles;
      const pace = formatPace(secondsPerMile);
      const stats = `Based on ${distance.toLocaleString()} meters in ${normalizedTime}, you ran ${miles.toFixed(
        2
      )} miles.`;

      return { pace, stats, secondsPerMile, miles, totalSeconds };
    };

    return {
      METERS_PER_MILE,
      formatPace,
      parseTime,
      calculatePace,
    };
  }
);
