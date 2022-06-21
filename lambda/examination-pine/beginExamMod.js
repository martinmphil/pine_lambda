const { getQList } = require("./getQListMod");
const { getQText } = require("./getQTextMod");
const { putDbItem } = require("./putDbItemMod");
const { initSubmission } = require("./initSubmissionMod");

const timestamp = new Date().toISOString();

async function beginExam(canId, examId) {
  const qList = await getQList(examId);
  const qIndex = 0;
  const html = await getQText(qList[qIndex].pKey, qList[qIndex].sKey);

  await putDbItem({
    TableName: "pine",
    Item: {
      pk: canId,
      sk: examId,
      entityType: "assessmentData",
      qList,
      qIndex,
      createdAt: timestamp,
    },
  });

  await initSubmission(canId, qList[qIndex].pKey);

  return html;
}

exports.beginExam = beginExam;
