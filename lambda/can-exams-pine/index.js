const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "pine";

async function getExamName(examId) {
  const examName = await dynamo
    .get({
      TableName,
      Key: {
        pk: examId,
        sk: examId,
      },
    })
    .promise()
    .then((x) => {
      return x?.Item?.name;
    })
    .catch((err) => {
      console.warn(` get exam-name for ${examId} failed:- ${err} `);
      throw err;
    });
  return examName ?? examId;
}

async function getExams(canId, entityType) {
  const result = await dynamo
    .get({
      TableName,
      Key: {
        pk: canId,
        sk: entityType,
      },
    })
    .promise()
    .then((x) => {
      return x?.Item?.arr ?? [];
    })
    .then(async (arr) => {
      return Promise.all(
        arr.map(async (examId) => {
          const examName = await getExamName(examId);
          return { examName, examId };
        })
      );
    });
  return result ?? [];
}

// eslint-disable-next-line no-unused-vars
exports.handler = async (event, context) => {
  try {
    const username = event.requestContext.authorizer.jwt.claims.username;
    const canId = `candidate#${username}`;
    const ongoing = await getExams(canId, "ongoing");
    const upcoming = await getExams(canId, "upcoming");
    const achieved = await getExams(canId, "achieved");
    return { body: JSON.stringify({ ongoing, upcoming, achieved }) };
  } catch (err) {
    return { error: err };
  }
};
