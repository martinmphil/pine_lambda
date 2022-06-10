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
      return dbData?.Item?.disciplines;
    });
}

async function putDisciplines(canId, standardExams) {
  return dynamo
    .put({
      TableName,
      Item: {
        pk: canId,
        sk: "disciplines",
        entityType: "disciplines",
        disciplines: standardExams,
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
        return putDisciplines(canId, standardExams);
      } else {
        fault += " Standard-exams list missing. ";
        console.warn(fault);
      }
    })
    .catch((error) => {
      fault += ` Put disciplines for standard-exams failed:- ${error.toString()} `;
      console.warn(fault);
    })
    .then(() => {
      return putCandidateData(canId);
    })
    .catch((err) => {
      fault += ` Put new-user-data failed:- ${error.toString()} `;
      console.warn(fault);
    });
}

exports.handler = async (event) => {
  try {
    // Returning the event continues our hosted-UI sign-up process.
    // Cognito-attribute "sub" (ie subject) uniquely identifies each user.
    const username = event?.request?.userAttributes?.sub;
    const canId = `candidate#${username}`;

    if (username) {
      await instantiateUser(canId);
    }

    return event;
  } catch (error) {
    fault += ` Lambda cognito-post-confirm-pine failed:- ${error.toString()}. `;
    console.warn({ error: fault });
    return event;
  }
};
