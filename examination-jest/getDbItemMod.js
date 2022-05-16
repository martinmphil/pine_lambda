const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

async function getDbItem(pk, sk) {
  return dynamo
    .get({
      TableName: "pine",
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

exports.getDbItem = getDbItem;
