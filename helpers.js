const globalScope = require("./globalScope");
const trim = (str) => {
  return str.replace(/\t/g, "").replace(/\n/g, "").trim();
};
const getInner = (str) => {
  const trimmed = trim(str);
  if (trimmed[0] === "(" && trimmed[trimmed.length - 1] === ")") {
    return trimmed.substring(1, trimmed.length - 1).trim();
  }
};
// const getAtoms = (expr) => {
//   const inner = getInner(expr);
//   const pieces = [];
//   let piece = "";
//   let parenCount = 0;
//   if (!inner) return [];
//   inner.split("").forEach((c, idx) => {
//     const eol = idx === inner.length - 1;
//     if (c === "(") {
//       parenCount += 1;
//     }
//     if (c === ")") {
//       parenCount -= 1;
//     }

//     const isSubExpression = parenCount > 0;
//     if (isSubExpression) {
//       piece += c;
//     } else if ((c.match(/\s/) && piece !== "") || eol) {
//       if (eol) piece += c;
//       pieces.push(piece);
//       piece = "";
//     } else if (!c.match(/\s/)) {
//       piece += `${c}`;
//     }
//   });
//   return pieces;
// };

const listify = (expr) => {
  const inner = getInner(expr);
  const pieces = [];
  let piece = "";
  let parenCount = 0;
  if (!inner) return [];
  inner.split("").forEach((c, idx) => {
    const eol = idx === inner.length - 1;
    if (c === "(") {
      parenCount += 1;
    }
    if (c === ")") {
      parenCount -= 1;
    }
    const isSubExpression = parenCount > 0;
    if (isSubExpression) {
      piece += c;
    } else if ((c.match(/\s/) && piece !== "") || eol || c === ")") {
      if (eol || c === ")") piece += c;
      pieces.push(piece);
      piece = "";
    } else if (!c.match(/\s/)) {
      piece += `${c}`;
    }
  });
  return pieces;
};

const isAtom = (expr) => {
  return expr.trim()[0] !== "(";
};

const getType = (atom, localScope) => {
  if (Array.isArray(atom)) return atom;
  if (atom[0] === '"') return atom.substring(1, atom.length - 1).trim();
  if (atom[0] === "#") return atom[1] === "t";
  if (
    typeof atom === "number" ||
    (typeof atom === "string" && atom.match(/^[0-9]+$/))
  ) {
    return Number(atom);
  }
  if (localScope[atom] !== undefined) return localScope[atom];
  if (globalScope[atom] !== undefined) return getType(globalScope[atom]);

  // console.error("no atom", atom);
  // throw new Error("cant find atom type");
  return atom;
};

const convertToScm = (param) => {
  if (typeof param === "string") {
    return `"${param}"`;
  }
  if (Array.isArray(param)) {
    return `(list ${param.map(convertToScm).join(" ")})`;
  }
  return param;
};

module.exports = {
  trim,
  getInner,
  isAtom,
  getType,
  listify,
  convertToScm,
};
