const { calculatePace } = require("../pace-utils.js");

const distanceMeters = 100;
const timeValue = "00:30";

const result = calculatePace(distanceMeters, timeValue);

if (result.error) {
  console.error(`Test failed: ${result.error}`);
  process.exitCode = 1;
} else {
  console.log(`Distance: ${distanceMeters} meters`);
  console.log(`Time: ${timeValue}`);
  console.log(`Pace: ${result.pace} per mile`);
  console.log(result.stats);
}
