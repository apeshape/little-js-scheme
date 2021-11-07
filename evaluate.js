const {
  getInner,
  trim,
  isAtom,
  getType,
  listify,
  // convertToScm,
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
  cons: (atm, list) => [atm, ...list],
  define: () => (name, value) => {
    globalScope[name] = value;
  },
  cond:
    (localScope) =>
    (...args) => {
      for (let i = 0; i < args[0].length; i++) {
        const [condition, body] = listify(args[0][i]);
        if (evaluate(condition, localScope)) {
          return evaluate(body, localScope);
        }
      }
    },
  lambda:
    (localScope) =>
    ([paramList, body]) => {
      const paramNames = getInner(paramList).split(" ").map(trim);
      const thisScope = {};
      return (...params) => {
        // let funcBody = body;
        console.log({ localScope });
        if (params.length < paramNames.length)
          throw new Error(
            `Expected ${paramNames.length} arguments, but got ${params.length}`
          );
        paramNames.forEach(
          (paramName, idx) => {
            thisScope[paramName] = params[idx];
          }
          // (funcBody = funcBody.replace(
          //   new RegExp(paramName, "g"),
          //   convertToScm(params[idx])
          // ))
        );

        return evaluate(body, { ...localScope, ...thisScope });
      };
    },
};

const specialFuncs = ["cond", "define", "lambda"];

const evaluate = (expr, localScope = {}) => {
  console.log(expr, localScope);
  if (isAtom(expr)) return getType(expr, localScope);
  const atoms = listify(expr);
  // const localScope = {};

  if (atoms.length > 0) {
    const [func, ...params] = atoms;
    if (func === "define") {
      globalScope[params[0]] = evaluate(params[1], localScope); //evaluate(params[1]);
      return;
    }
    if (specialFuncs.includes(func)) {
      return funcs[func](localScope)(params);
    }
    if (Object.keys(funcs).includes(func)) {
      return funcs[func](...params.map((param) => evaluate(param, localScope)));
    }
    if (Object.keys(localScope).includes(func)) {
      return localScope[func](
        ...params.map((param) => evaluate(param, localScope))
      );
    }
    if (Object.keys(globalScope).includes(func)) {
      return globalScope[func](
        ...params.map((param) => evaluate(param, localScope))
      );
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
