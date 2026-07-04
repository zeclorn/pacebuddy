const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseTime,
  parseDistance,
  formatCompactTime,
  formatTime,
  calculatePace,
  METERS_PER_MILE,
} = require("../pace-utils.js");

test("parseTime accepts ss, mm:ss, and hh:mm:ss", () => {
  assert.equal(parseTime("45"), 45);
  assert.equal(parseTime("00:30"), 30);
  assert.equal(parseTime("23:45"), 23 * 60 + 45);
  assert.equal(parseTime("1:05:30"), 3600 + 5 * 60 + 30);
  assert.equal(parseTime(" 25:00 "), 1500);
});

test("parseTime accepts bare seconds of 60 or more", () => {
  assert.equal(parseTime("90"), 90);
  assert.equal(parseTime("600"), 600);
});

test("parseTime rejects malformed input", () => {
  assert.equal(parseTime("1::30"), null);
  assert.equal(parseTime("1.5:30"), null);
  assert.equal(parseTime("1:75"), null);
  assert.equal(parseTime("1:75:00"), null);
  assert.equal(parseTime("1:00:00:00"), null);
  assert.equal(parseTime("-30"), null);
  assert.equal(parseTime(""), null);
  assert.equal(parseTime("abc"), null);
  assert.equal(parseTime(90), null);
});

test("parseDistance converts each unit to meters", () => {
  assert.equal(parseDistance("5000", "meters"), 5000);
  assert.equal(parseDistance("5", "km"), 5000);
  assert.equal(parseDistance("1", "miles"), METERS_PER_MILE);
  assert.equal(parseDistance("3.1", "miles"), 3.1 * METERS_PER_MILE);
});

test("parseDistance rejects invalid values and units", () => {
  assert.equal(parseDistance("0", "meters"), null);
  assert.equal(parseDistance("-5", "km"), null);
  assert.equal(parseDistance("", "meters"), null);
  assert.equal(parseDistance("abc", "meters"), null);
  assert.equal(parseDistance("5000", "furlongs"), null);
});

test("formatCompactTime expands digit strings", () => {
  assert.equal(formatCompactTime(""), "");
  assert.equal(formatCompactTime("59"), "59");
  assert.equal(formatCompactTime("825"), "8:25");
  assert.equal(formatCompactTime("0825"), "8:25");
  assert.equal(formatCompactTime("1234"), "12:34");
  assert.equal(formatCompactTime("12345"), "1:23:45");
  assert.equal(formatCompactTime("012345"), "1:23:45");
});

test("formatCompactTime leaves ambiguous or invalid groupings alone", () => {
  assert.equal(formatCompactTime("060"), "060");
  assert.equal(formatCompactTime("1075"), "1075");
  assert.equal(formatCompactTime("12:34"), "12:34");
  assert.equal(formatCompactTime("1234567"), "1234567");
});

test("formatTime rolls over to hours", () => {
  assert.equal(formatTime(483), "8:03");
  assert.equal(formatTime(4530), "1:15:30");
  assert.equal(formatTime(59.6), "1:00");
});

test("calculatePace returns known paces for 5K in 25:00", () => {
  const result = calculatePace("5000", "25:00", "meters");
  assert.equal(result.error, undefined);
  assert.equal(result.pacePerMile, "8:03");
  assert.equal(result.pacePerKm, "5:00");
  assert.equal(result.totalSeconds, 1500);
  assert.equal(result.distanceMeters, 5000);
  assert.equal(result.km, 5);
});

test("calculatePace treats units as equivalent distances", () => {
  const meters = calculatePace("5000", "25:00", "meters");
  const km = calculatePace("5", "25:00", "km");
  assert.equal(meters.pacePerMile, km.pacePerMile);
  assert.equal(meters.pacePerKm, km.pacePerKm);

  const miles = calculatePace("1", "8:00", "miles");
  assert.equal(miles.pacePerMile, "8:00");
});

test("calculatePace accepts bare seconds", () => {
  const result = calculatePace("400", "90", "meters");
  assert.equal(result.error, undefined);
  assert.equal(result.totalSeconds, 90);
});

test("calculatePace returns errors for invalid input", () => {
  assert.match(calculatePace("", "25:00").error, /distance/i);
  assert.match(calculatePace("0", "25:00").error, /distance/i);
  assert.match(calculatePace("5000", "1::30").error, /valid time/i);
  assert.match(calculatePace("5000", "0").error, /valid time/i);
});
