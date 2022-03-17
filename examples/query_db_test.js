const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient({ region: "eu-west-1" });

exports.handler = async (event) => {
  let result = await dynamo
    .query({
      TableName: "pine",
      KeyConditionExpression: "pk = :hashKey",
      ExpressionAttributeValues: {
        ":hashKey": "text1",
      },
    })
    .promise();

  console.log(result);

  const response = {
    statusCode: 200,
    body: JSON.stringify(result.Items[0].markup),
  };
  return response;
};
