const { getQText } = require("./getQTextMod");
const { submission } = require("./submissionMod");
const { nextQ } = require("./nextQMod");
const { incrementAssessmentData } = require("./incrementAssessmentDataMod");
const { markExam } = require("./markExamMod");
const { achieved } = require("./achievedMod");

async function examCompleted(canId, examId, assessmentData) {
  if (assessmentData.mark && assessmentData.outOf) {
    return achieved(
      assessmentData.mark,
      assessmentData.outOf,
      assessmentData.grade
    );
  }
  const examMark = await markExam(canId, examId, assessmentData);
  return examMark;
}

async function examInProgress(
  canId,
  examId,
  assessmentData,
  candidateAnswer = ""
) {
  try {
    if (!assessmentData || Object.keys(assessmentData).length < 1) {
      throw ` Invalid assessment-data in exam-in-progress-fn for candidate ${canId} sitting ${examId} `;
    }

    if (assessmentData?.qIndex < 0) {
      const result = await examCompleted(canId, examId, assessmentData);
      return result;
    }

    const qIndex = Number.parseInt(assessmentData.qIndex);
    if (Number.isInteger(assessmentData.qIndex) === false) {
      throw ` Invalid question-index in exam-in-progress-fn for candidate ${canId} sitting ${examId} `;
    }

    const qList = assessmentData?.qList;
    if (qList === undefined || qList === null) {
      throw ` Invalid question-list in exam-in-progress-fn for candidate ${canId} sitting ${examId} `;
    }

    if (Boolean(candidateAnswer) === false) {
      return await getQText(qList[qIndex].pKey, qList[qIndex].sKey);
    }

    const submissionReturnValue = await submission(
      canId,
      qList[qIndex].pKey,
      candidateAnswer
    );

    if (!submissionReturnValue) {
      throw ` Faulty submission-fn returned ${submissionReturnValue} in exam-in-progress-fn for candidate ${canId} sitting ${examId} `;
    }

    const nextQIndex = qIndex + 1;
    if (qList[nextQIndex]) {
      return nextQ(
        canId,
        examId,
        nextQIndex,
        qList[nextQIndex].pKey,
        qList[nextQIndex].sKey
      );
    }
    await incrementAssessmentData(canId, examId, -1);
    return "end_of_exam-standard_fixed_id_ne5gei8phi0al0oM";
  } catch (error) {
    throw ` Faulty exam-in-progress fn:- ${error.toString()} `;
  }
}

exports.examInProgress = examInProgress;
