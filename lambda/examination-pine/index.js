const { getAssessmentData } = require("./getAssessmentDataMod");
const { beginExam } = require("./beginExamMod");
const { examInProgress } = require("./examInProgressMod");

let body = "";
const canAnswer = "";
let fault = "";

function validString(x) {
  if (typeof x === "string" && x.length > 0) {
    return true;
  } else return false;
}

exports.handler = async (event) => {
  try {
    const username = event.requestContext.authorizer.jwt.claims.username;
    const examCode = event.pathParameters.idNbr;
    // const examCode = "1";
    // const username = "dummy_user";
    //
    if (!validString(examCode)) {
      throw ` exam-code missing `;
    }
    if (!validString(username)) {
      throw ` username missing `;
    }

    const canId = `candidate#${username}`;
    const examId = `exam#${examCode}`;

    const assessmentData = await getAssessmentData(canId, examId);

    if (assessmentData && Object.keys(assessmentData).length > 0) {
      body = await examInProgress(canId, examId, assessmentData, canAnswer);
    } else {
      body = await beginExam(canId, examId);
    }
    return { body: JSON.stringify(body) };
  } catch (err) {
    fault += ` Lambda fn examination-pine failed:- ${JSON.stringify(err)} `;
    return { error: fault };
  }
};
