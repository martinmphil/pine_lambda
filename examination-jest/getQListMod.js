const { getDbItem } = require("./getDbItemMod");

const validStr = (x) => typeof x === "string" && x.length > 0;
const checkProps = (y) => validStr(y.pKey) && validStr(y.sKey);
const validQList = (z) => z.every(checkProps);

async function getQList(examId) {
  const qList = await getDbItem(examId, examId).then((Item) => {
    return Item?.qList;
  });
  if (validQList(qList)) {
    return qList;
  } else throw ` Invalid question-list for exam ${examId}. `;
}

exports.getQList = getQList;

// for unit test
exports.validQList = validQList;
