const { trim, getInner, listify } = require("./helpers");
const { evaluate } = require("./evaluate");
const globalScope = require("./globalScope");
const funcs = {
  "+": (...args) => args.reduce((acc, curr) => acc + curr, 0),
  "*": (...args) => args.reduce((acc, curr) => acc * curr),
  "-": (...args) => args[0] - args[1],
  "/": (...args) => args[0] / args[1],
  "%": (...args) => args[0] % args[1],
  list: (...args) => args,
  "eq?": (...args) => args[0] === args[1],
  else: true,
  cond: (...args) => {
    for (let i = 0; i < args[0].length; i++) {
      const [condition, body] = listify(args[0][i]);
      if (evaluate(condition)) {
        return body;
      }
    }
  },
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
          (funcBody = funcBody.replace(new RegExp(paramName, "g"), params[idx]))
      );

      return evaluate(funcBody);
    };
  },
};

module.exports = funcs;
