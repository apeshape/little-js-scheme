const { expect } = require("@jest/globals");
const { evaluate } = require("./evaluate");

test("can define", () => {
  const def = `(define janne 7)`;
  evaluate(def);
  const result = evaluate(`janne`);
  expect(result).toBe(7);
});
