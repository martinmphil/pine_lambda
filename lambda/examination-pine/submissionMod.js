const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const timestamp = new Date().toISOString();

async function submission(canId, qTextId, candidateAnswer) {
  return dynamo
    .update({
      TableName: "pine",
      Key: {
        pk: canId,
        sk: qTextId,
      },
      UpdateExpression: "set candidateAnswer = :a, updatedAt = :up",
      ExpressionAttributeValues: {
        ":a": candidateAnswer,
        ":up": timestamp,
      },
      ConditionExpression:
        "attribute_exists(pk) and attribute_not_exists(candidateAnswer)",
      ReturnValues: "UPDATED_NEW",
    })
    .promise();
}

exports.submission = submission;
