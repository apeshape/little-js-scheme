const trim = (str) => {
  return str.replace(/\t/g, "").replace(/\n/g, "").trim();
};
const getInner = (str) => {
  const trimmed = trim(str);
  if (trimmed[0] === "(" && trimmed[trimmed.length - 1] === ")") {
    return trimmed.substring(1, trimmed.length - 1).trim();
  }
};

const getParts = (expr) => {
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

const getType = (atom) => {
  if (Array.isArray(atom)) return atom;
  if (atom[0] === '"') return atom.substring(1, atom.length - 1).trim();
  if (atom[0] === "#") return atom[1] === "t";
  if (
    typeof atom === "number" ||
    (typeof atom === "string" && atom.match(/^[0-9]+$/))
  ) {
    return Number(atom);
  }

  return atom;
};

module.exports = {
  trim,
  getInner,
  isAtom,
  getType,
  getParts,
};
