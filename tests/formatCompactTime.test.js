const { formatCompactTime } = require("../script.js");

const cases = [
  { input: "", expected: "" },
  { input: "59", expected: "59" },
  { input: "825", expected: "8:25" },
  { input: "0825", expected: "8:25" },
  { input: "1234", expected: "12:34" },
  { input: "12345", expected: "1:23:45" },
  { input: "012345", expected: "1:23:45" },
];

let failureCount = 0;

for (const { input, expected } of cases) {
  const result = formatCompactTime(input);
  if (result !== expected) {
    console.error(`Expected \"${input}\" to format to \"${expected}\" but got \"${result}\".`);
    failureCount += 1;
  } else {
    console.log(`\"${input}\" formatted to \"${result}\" as expected.`);
  }
}

if (failureCount > 0) {
  process.exitCode = 1;
}
