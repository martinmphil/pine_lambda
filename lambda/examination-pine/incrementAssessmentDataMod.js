const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const timestamp = new Date().toISOString();

async function incrementAssessmentData(canId, examId, nexQIndex) {
  return dynamo
    .update({
      TableName: "pine",
      Key: {
        pk: canId,
        sk: examId,
      },
      UpdateExpression: "set qIndex = :i, updatedAt = :up",
      ExpressionAttributeValues: {
        ":i": nexQIndex,
        ":up": timestamp,
      },
      ConditionExpression: "attribute_exists(qIndex)",
      ReturnValues: "UPDATED_NEW",
    })
    .promise();
}

exports.incrementAssessmentData = incrementAssessmentData;
