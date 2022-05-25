const validStr = (x) => typeof x === "string" && x.length > 0;
const checkProps = (y) => validStr(y.pKey) && validStr(y.sKey);
const validateQList = (z) => z.every(checkProps);

exports.validateQList = validateQList;
