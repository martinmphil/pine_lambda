const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const dbData = await dynamo
      .get({
        TableName: "pine",
        Key: {
          pk: "text1",
          sk: "4Multichoice",
        },
      })
      .promise();
    body = dbData?.Item?.markup;
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
