const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "pine";
// const timestamp = new Date().toISOString();
let fault = "";

async function getAssessmentData(canId, examId) {
  return dynamo
    .get({
      TableName,
      Key: {
        pk: canId,
        sk: examId,
      },
    })
    .promise()
    .then((dbData) => {
      return dbData?.Item;
    });
}

exports.handler = async (event) => {
  try {
    //const username = event.requestContext.authorizer.jwt.claims.username;
    const username = "dummy_user";
    console.log(JSON.stringify(event) + " " + username);
    //
    //
    const canId = `candidate#${username}`;
    const examCode = event.pathParameters.idNbr;
    const examId = `èxam#${examCode}`;

    const assessmentRecord = await getAssessmentData(canId, examId);

    // html output
    const nextQHtml = `user is ${canId} and exam is ${examId} and assessment record is ${JSON.stringify(
      assessmentRecord
    )}`;

    return { body: JSON.stringify(nextQHtml) };
  } catch (err) {
    fault += ` Lambda fn examination-pine failed:- ${JSON.stringify(err)} `;
    return { error: fault };
  }
};
