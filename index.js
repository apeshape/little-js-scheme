const { evaluateFile } = require("./evaluate");

if (process.argv[2]) {
  const out = evaluateFile(process.argv[2]);
  console.log(out);
} else {
  console.log("Please provide .scm filename to run");
}
