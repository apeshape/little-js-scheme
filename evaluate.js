const {
  getInner,
  trim,
  isAtom,
  getType,
  listify,
  convertToScm,
} = require("./helpers");
const globalScope = require("./globalScope");
const fs = require("fs");

// const funcs = require("./functions");

const funcs = {
  "+": (...args) => args.reduce((acc, curr) => acc + curr, 0),
  "*": (...args) => args.reduce((acc, curr) => acc * curr),
  "-": (...args) => args[0] - args[1],
  "/": (...args) => args[0] / args[1],
  "%": (...args) => args[0] % args[1],
  list: (...args) => args || [],
  "eq?": (...args) => args[0] === args[1],
  "null?": (list) => Array.isArray(list) && list.length === 0,
  "list?": (list) => Array.isArray(list),
  not: (input) => Boolean(input) === false,
  else: true,
  car: (list) => list[0],
  cdr: ([, ...rest]) => rest || [],
  cond: (...args) => {
    for (let i = 0; i < args[0].length; i++) {
      const [condition, body] = listify(args[0][i]);
      if (evaluate(condition)) {
        return evaluate(body);
      }
    }
  },
  cons: (atm, list) => [atm, ...list],
  define: (name, value) => {
    globalScope[name] = value;
  },
  lambda: ([paramList, body]) => {
    const paramNames = getInner(paramList).split(" ").map(trim);
    return (...params) => {
      let funcBody = body;
      if (params.length < paramNames.length)
        throw new Error(
          `Expected ${paramNames.length} arguments, but got ${params.length}`
        );
      paramNames.forEach(
        (paramName, idx) =>
          (funcBody = funcBody.replace(
            new RegExp(paramName, "g"),
            convertToScm(params[idx])
          ))
      );

      return evaluate(funcBody);
    };
  },
};

const specialFuncs = ["cond", "define", "lambda"];

const evaluate = (expr /*parentScope = null*/) => {
  if (isAtom(expr)) return getType(expr);
  const atoms = listify(expr);
  // const localScope = {};

  if (atoms.length > 0) {
    const [func, ...params] = atoms;
    if (func === "define") {
      globalScope[params[0]] = evaluate(params[1]); //evaluate(params[1]);
      return;
    }
    if (specialFuncs.includes(func)) {
      return funcs[func](params);
    }
    if (Object.keys(funcs).includes(func)) {
      return funcs[func](...params.map(evaluate));
    }
    if (Object.keys(globalScope).includes(func)) {
      return globalScope[func](...params.map(evaluate));
    } else {
      throw new Error(`Function "${func}" is not defined`);
    }
  }
  return atoms;
};

const evaluateFile = (path) => {
  const str = fs.readFileSync(path, {
    encoding: "utf-8",
  });

  const expressions = listify(`(${str})`);
  return expressions.reduce((acc, curr) => {
    return evaluate(curr);
  }, null);
};

module.exports = {
  evaluate,
  evaluateFile,
};
