const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "pine";

const dbPromise = (pk, sk) => {
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
      return dbItem?.Item?.arr;
    })
    .catch((err) => {
      const fault = ` Get db-data for ${pk} failed:- ${JSON.stringify(err)} `;
      console.warn(fault);
      throw fault;
    });
};

exports.handler = async (event) => {
  try {
    const username = event.requestContext.authorizer.jwt.claims.username;
    const pk = `candidate#${username}`;
    const sk = "ongoing";
    const dbData = await dbPromise(pk, sk);
    return { body: JSON.stringify(dbData) };
  } catch (err) {
    const fault = ` Lambda my_fn_name failed:- ${JSON.stringify(err)} `;
    console.warn(fault);
    return {
      error: fault,
    };
  }
};
