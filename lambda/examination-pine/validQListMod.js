const validStr = (x) => typeof x === "string" && x.length > 0;
const checkProps = (y) => validStr(y.pKey) && validStr(y.sKey);
const validQList = (z) =>
  Array.isArray(z) && z.length > 0 && z.every(checkProps);

exports.validQList = validQList;
