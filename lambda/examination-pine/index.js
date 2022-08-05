const { getAssessmentData } = require("./getAssessmentDataMod");
const { beginExam } = require("./beginExamMod");
const { examInProgress } = require("./examInProgressMod");

let body = "";
let fault = "";

function validString(x) {
  if (typeof x === "string" && x.length > 0) {
    return true;
  }
  return false;
}

exports.handler = async (event) => {
  try {
    // const username = "dummy_user";
    // const examId = "exam#1";
    const username = event.requestContext.authorizer.jwt.claims.username;
    const examId = event.pathParameters.examId;
    const candidateAnswer = event.body;

    if (!validString(username)) {
      throw ` Username missing from examination-pine λ fn. `;
    }
    if (!validString(examId)) {
      throw ` Exam-id missing from examination-pine λ fn. `;
    }

    const canId = `candidate#${username}`;

    const assessmentData = await getAssessmentData(canId, examId);

    if (assessmentData && Object.keys(assessmentData).length > 0) {
      body = await examInProgress(
        canId,
        examId,
        assessmentData,
        candidateAnswer
      );
      return { body };
    }
    body = await beginExam(canId, examId);
    return { body };
  } catch (error) {
    fault += ` Lambda fn examination-pine failed:- ${error.toString()} `;
    return { error: fault };
  }
};
