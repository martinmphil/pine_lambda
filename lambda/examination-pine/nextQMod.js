const { incrementAssessmentData } = require("./incrementAssessmentDataMod");
const { initSubmission } = require("./initSubmissionMod");
const { getQText } = require("./getQTextMod");

async function nextQ(canId, examId, qIndex, qTextId, qEntityType) {
  await incrementAssessmentData(canId, examId, qIndex);
  await initSubmission(canId, qTextId);

  return getQText(qTextId, qEntityType);
}

exports.nextQ = nextQ;
