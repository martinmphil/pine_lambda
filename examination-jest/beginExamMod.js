const { getQList } = require("./getQListMod");

async function beginExam(canId, examId) {
  const qList = await getQList(examId);
  return `this is beginExam return ${JSON.stringify(qList)}`;
}

exports.beginExam = beginExam;
