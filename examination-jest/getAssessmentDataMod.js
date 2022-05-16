const { getDbItem } = require("./getDbItemMod");

async function getAssessmentData(canId, examId) {
  return getDbItem(canId, examId);
}

exports.getAssessmentData = getAssessmentData;
