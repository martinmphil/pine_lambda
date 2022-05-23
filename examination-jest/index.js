const { getAssessmentData } = require("./getAssessmentDataMod");
const { beginExam } = require("./beginExamMod");
const { examInProgress } = require("./examInProgressMod");

// const timestamp = new Date().toISOString();
let fault = "";
// let qList = [];
// let qIndex = 0;
let body = "";
const canAnswer = "";

exports.handler = async (event) => {
  try {
    // const username = event.requestContext.authorizer.jwt.claims.username;
    // const examCode = event.pathParameters.idNbr;
    const examCode = "1";
    const username = "dummy_user";
    //
    const canId = `candidate#${username}`;
    const examId = `exam#${examCode}`;

    const assessmentData = await getAssessmentData(canId, examId);

    if (assessmentData) {
      body = await examInProgress(canId, examId, canAnswer);
    } else {
      body = await beginExam(canId, examId);
    }
    return { body };
  } catch (err) {
    fault += ` Lambda fn examination-pine failed:- ${JSON.stringify(err)} `;
    return { error: fault };
  }
};
