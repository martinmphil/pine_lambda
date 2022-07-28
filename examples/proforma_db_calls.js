const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "pine";

async function getDbItem(pk, sk) {
  return dynamo
    .get({
      TableName,
      Key: {
        pk,
        sk,
      },
    })
    .promise()
    .then((dbItem) => {
      const result = dbItem?.Item;
      if (result === undefined || null) {
        throw ` DynamoDB get (${pk}, ${sk}) failed for ${result}. `;
      }
      return result;
    });
}

exports.handler = async (event) => {
  try {
    const username = event.requestContext.authorizer.jwt.claims.username;
    const pk = `candidate#${username}`;
    const sk = "ongoing";
    const body = await getDbItem(pk, sk);
    return { body };
  } catch (error) {
    const fault = ` Lambda my_fn_name failed:- ${error.toString()} `;
    console.warn(fault);
    return {
      error: fault,
    };
  }
};
