const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "pine";

exports.handler = async (event, context) => {
  try {
    const dbData = await dynamo
      .get({
        TableName,
        Key: {
          pk: "text1",
          sk: "4Multichoice",
        },
      })
      .promise();
    markup = dbData?.Item?.markup;
    return { body: JSON.stringify(markup) };
  } catch (err) {
    return { error: err };
  }
};
