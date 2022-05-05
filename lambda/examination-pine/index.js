const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "pine";
const timestamp = new Date().toISOString();
let fault = "";
let qList = [];
let qIndex = 0;

async function examinationProcess(canId, examId) {
  const assessmentData = await getAssessmentData(canId, examId);

  if (assessmentData === undefined || null) {
    qIndex = 0;
    qList = await getQList(examId);

    if (qList === undefined || qList.length === 0) {
      throw ` Question-list missing for exam ${examId} `;
    }

    await putAssessmentData(canId, examId, qIndex);

    //
    //
    // To complete the top line of the exam flow chart I need to create submissions record for qList[qIndex]
  }

  return qList;
}

async function getDbItem(pk, sk) {
  return dynamo
    .get({
      TableName,
      Key: {
        pk,
        sk,
      },
    })
    .promise()
    .then((dbData) => {
      return dbData?.Item;
    });
}

async function getAssessmentData(canId, examId) {
  return getDbItem(canId, examId);
}

async function getQList(examId) {
  return getDbItem(examId, examId).then((Item) => {
    return Item?.qList;
  });
}

async function putAssessmentData(canId, examId, qIndex) {
  dynamo
    .put({
      TableName,
      Item: {
        pk: canId,
        sk: examId,
        entityType: "assessmentData",
        qIndex,
        qList,
        startTime: timestamp,
      },
      ConditionExpression:
        "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    })
    .promise()
    .catch((err) => {
      const fault = ` put-assessment-data failed for user ${canId} and exam ${examId}:- ${JSON.stringify(
        err
      )} `;
      console.warn(fault);
      throw fault;
    });
}

exports.handler = async (event) => {
  try {
    //const username = event.requestContext.authorizer.jwt.claims.username;
    // const examCode = event.pathParameters.idNbr;
    const examCode = "1";
    const username = "dummy_user";
    console.log(JSON.stringify(event) + " " + username);
    //
    const canId = `candidate#${username}`;
    const examId = `exam#${examCode}`;

    const bravo = await examinationProcess(canId, examId);

    // html output
    const nextQHtml = `user is ${canId} and exam is ${examId} and assessment record is ${JSON.stringify(
      bravo
    )}`;

    return { body: JSON.stringify(nextQHtml) };
  } catch (err) {
    fault += ` Lambda fn examination-pine failed:- ${JSON.stringify(err)} `;
    return { error: fault };
  }
};
