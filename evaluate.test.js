const { expect } = require("@jest/globals");
const { evaluate, evaluateFile } = require("./evaluate");

test("nested list", () => {
  const nested = `(list 2 3 (list 23 98 (+ 5 6)))`;
  const val = evaluate(nested);
  expect(val.length).toBeGreaterThan(0);
});
test("Can add with whitespace", () => {
  const str = `
    (* 1 22 
      (+ 17 (- 23 12))
    )
    `;
  expect(evaluate(str)).toBe(616);
});
test("Can do nested", () => {
  const str = `(+ 23 98 (+ 1 2 3))`;
  const evaled = evaluate(str);
  expect(evaled).toBe(127);
});
test("Condition with eq", () => {
  const cond = `
    (cond
      ((eq? 1 2) "test")
      ((eq? 1 2) "test2")
      (else (+ 2 3 (* 3 2)))
    )
  `;
  const evaled = evaluate(cond);
  expect(evaled).toBe(11);
});

test("List with strings", () => {
  const list = `(list "apa" "janne" "kossa" 23 #t #f)`;
  const evaled = evaluate(list);
  expect(evaled.length).toBeGreaterThan(0);
});

test("Multiple expressions from file", () => {
  const result = evaluateFile("./scm/multipleExpressions.scm");
  expect(result).toBe(1);
});

test("List from file", () => {
  const list = evaluateFile("./scm/list.scm");
  expect(list).toHaveLength(5);
});

test("cdr", () => {
  const str = `(cdr (list 1 2 3 4 5))`;
  const result = evaluate(str);

  expect(result).toHaveLength(4);
});

test("cons", () => {
  const str = `(cons 3 (list 2 1))`;
  const result = evaluate(str);
  expect(result).toHaveLength(3);
});

test("cdr from file", () => {
  const cdr = evaluateFile("./scm/cdr.scm");
  expect(cdr).toHaveLength(4);
});

test("car from file", () => {
  const car = evaluateFile("./scm/car.scm");
  expect(car).toBe(2);
});

test("Lambda with recursion", () => {
  const val = evaluateFile("./scm/little.scm");
  expect(val).toStrictEqual(["kalas", "apa"]);
});

// test("Should throw func is not defined", () => {
//   const str = `(apa 1 2 3)`;
//   expect(evaluate(str)).toThrow();
// });
