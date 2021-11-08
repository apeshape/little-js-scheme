const { getInner, trim, isAtom, getType, getParts } = require("./helpers");
const fs = require("fs");

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
  define:
    (localScope) =>
    ([name, value]) => {
      localScope[name] = evaluate(value, localScope);
    },
  cond:
    (localScope) =>
    (...args) => {
      for (let i = 0; i < args[0].length; i++) {
        const [condition, body] = getParts(args[0][i]);
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
        if (params.length < paramNames.length)
          throw new Error(
            `Expected ${paramNames.length} arguments, but got ${params.length}`
          );
        paramNames.forEach((paramName, idx) => {
          thisScope[paramName] = params[idx];
        });

        return evaluate(body, { ...localScope, ...thisScope });
      };
    },
};

const specialFuncs = ["cond", "define", "lambda"];

const evaluate = (expr, localScope = {}) => {
  if (isAtom(expr)) return localScope[expr] || getType(expr, localScope);
  const parts = getParts(expr);

  if (parts.length > 0) {
    const [func, ...params] = parts;
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
    } else {
      throw new Error(`Function "${func}" is not defined`);
    }
  }
  return parts;
};

const evaluateFile = (path) => {
  try {
    const str = fs.readFileSync(path, {
      encoding: "utf-8",
    });

    const scope = {};

    const expressions = getParts(`(${str})`);
    return expressions.reduce((acc, curr) => {
      return evaluate(curr, scope);
    }, null);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`File '${path}' does not exist`);
    }
  }
};

module.exports = {
  evaluate,
  evaluateFile,
};
