const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "pine";
const timestamp = new Date().toISOString();
let fault = "";

async function getStandardExams() {
  return dynamo
    .get({
      TableName,
      Key: {
        pk: "standardExams",
        sk: "standardExams",
      },
    })
    .promise()
    .then((dbData) => {
      return dbData?.Item?.arr;
    });
}

async function putUcoming(canId, standardExams) {
  return dynamo
    .put({
      TableName,
      Item: {
        pk: canId,
        sk: "upcoming",
        entityType: "upcoming",
        arr: standardExams,
      },
      ConditionExpression:
        "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    })
    .promise();
}

async function putCandidateData(canId) {
  return dynamo
    .put({
      TableName,
      Item: {
        pk: canId,
        sk: canId,
        entityType: "candidateData",
        obj: { registrationDate: timestamp },
      },
      ConditionExpression:
        "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    })
    .promise();
}

async function instantiateUser(canId) {
  return getStandardExams()
    .then((standardExams) => {
      if (standardExams) {
        return putUcoming(canId, standardExams);
      } else {
        fault += " Standard-exams list missing. ";
        console.warn(fault);
      }
    })
    .catch((err) => {
      const errStr = JSON.stringify(err);
      fault += " Put upcoming standard-exams list failed. " + errStr;
      console.warn(fault);
    })
    .then(() => {
      return putCandidateData(canId);
    })
    .catch((err) => {
      const errStr = JSON.stringify(err);
      fault += " Put new-user-data failed. " + errStr;
      console.warn(fault);
    });
}

exports.handler = async (event) => {
  try {
    // Return event continues hosted-UI sign-up process.
    // Cognito attribute "sub" (subject) uniquely identifies a user.
    const username = event?.request?.userAttributes?.sub;
    const canId = `candidate#${username}`;

    if (username) {
      await instantiateUser(canId);
    }

    return event;
  } catch (err) {
    fault += ` Lambda cognito-post-confirm-pine failed:- ${err}. `;
    console.warn({ error: fault });
    return event;
  }
};
