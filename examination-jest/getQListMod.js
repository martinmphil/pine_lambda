const { getDbItem } = require("./getDbItemMod");

async function getQList(examId) {
  return getDbItem(examId, examId).then((Item) => {
    return Item?.qList;
  });
}

exports.getQList = getQList;
