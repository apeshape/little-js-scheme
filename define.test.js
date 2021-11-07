const { expect } = require("@jest/globals");
const { evaluate } = require("./evaluate");

test("can define", () => {
  const scope = {};
  const def = `(define janne 7)`;
  evaluate(def, scope);
  const result = evaluate(`janne`, scope);
  expect(result).toBe(7);
});

test("define value", () => {
  const scope = {};
  evaluate(`(define jaa 34)`, scope);
  const list = evaluate(`(list 1 2 jaa)`, scope);
  expect(list).toStrictEqual([1, 2, 34]);
  console.log("list", list);
});
