const { evaluateFile } = require("./evaluate");
// const { getAtoms } = require("./helpers");

// const multiExprs = `(
//   (define apa 7)
//   apa
//   )
// `;

console.log(evaluateFile("./scm/little.scm"));

// const expressions = getAtoms(multiExprs);

// expressions.map((exp) => console.log("eval", evaluate(exp)));

// console.log("expressionse", expressions);

// const atm = `(define apa (lambda (i j ape) (+ 1 i j ape)))`;
// // const addOne = `(apa (+ 1 5 (* 3 4 (- 9 5))) 5 8 11 22)`;
// console.log(evaluate(atm));
// // console.log(evaluate(addOne));
// console.log({ globalScope });
