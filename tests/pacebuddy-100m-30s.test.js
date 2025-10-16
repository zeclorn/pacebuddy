const { calculatePace } = require("../pace-utils.js");

const testCases = [
  {
    description: "handles mm:ss input",
    distanceMeters: 100,
    timeValue: "00:30",
  },
  {
    description: "handles ss input",
    distanceMeters: 100,
    timeValue: "45",
  },
];

let hasFailure = false;

for (const { description, distanceMeters, timeValue } of testCases) {
  const result = calculatePace(distanceMeters, timeValue);

  if (result.error) {
    console.error(
      `Test failed for ${description} (${distanceMeters}m in ${timeValue}): ${result.error}`
    );
    hasFailure = true;
  } else {
    console.log(`Distance: ${distanceMeters} meters`);
    console.log(`Time: ${timeValue}`);
    console.log(`Pace: ${result.pace} per mile`);
    console.log(result.stats);
  }
}

if (hasFailure) {
  process.exitCode = 1;
}
