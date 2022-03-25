const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "pine";

exports.handler = async (event, context) => {
  try {
    const username = event.requestContext.authorizer.jwt.claims.username;

    const pk = `candidate#${username}`;

    const sk = "ongoing";

    const dbData = await dynamo
      .get({
        TableName,
        Key: {
          pk,
          sk,
        },
      })
      .promise()
      .then((dbItem) => {
        return dbItem?.Item?.arr;
      });
    return { body: JSON.stringify(dbData) };
  } catch (err) {
    return { error: err };
  }
};
