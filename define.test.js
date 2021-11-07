const { expect } = require("@jest/globals");
const { evaluate } = require("./evaluate");

test("can define", () => {
  const def = `(define janne 7)`;
  evaluate(def);
  const result = evaluate(`janne`);
  expect(result).toBe(7);
});

test("define value", () => {
  evaluate(`(define jaa 34)`);
  const list = evaluate(`(list 1 2 jaa)`);
  console.log("list", list);
});
