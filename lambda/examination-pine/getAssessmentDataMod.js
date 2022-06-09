const { getDbItem } = require("./getDbItemMod");
const { validQList } = require("./validQListMod");

function validAssessmentData(canId, examId, assessmentData) {
  const qIndex = assessmentData?.qIndex;
  if (Number.isInteger(qIndex) === false) {
    throw ` Invalid question-index on assessment-data for candiate ${canId} sitting ${examId} `;
  }

  const qList = assessmentData?.qList;
  if (validQList(qList) === false) {
    throw ` Invalid question-list on assessment-data for candiate ${canId} sitting ${examId} `;
  }

  return true;
}

async function getAssessmentData(canId, examId) {
  const assessmentData = await getDbItem(canId, examId);
  if (
    Boolean(assessmentData) === false ||
    Object.keys(assessmentData).length < 1
  ) {
    return false;
  }

  if (validAssessmentData(canId, examId, assessmentData)) {
    return assessmentData;
  } else {
    return false;
  }
}

exports.getAssessmentData = getAssessmentData;
