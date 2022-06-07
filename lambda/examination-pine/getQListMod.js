const { getDbItem } = require("./getDbItemMod");
const { validQList } = require("./validQListMod");

async function getQList(examId) {
  const qList = await getDbItem(examId, examId).then((Item) => {
    return Item?.qList;
  });
  if (validQList(qList)) {
    return qList;
  } else throw ` Invalid question-list from getQListMod for exam ${examId}. `;
}

exports.getQList = getQList;
