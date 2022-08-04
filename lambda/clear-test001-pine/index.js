const { bacchus } = require("./bacchus");
// bacchus is in cloud not in this repo.

const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "pine";

const canId = `candidate#${bacchus}`;
let body = "";

const validStr = (x) => typeof x === "string" && x.length > 0;
const checkProps = (y) => validStr(y.pKey) && validStr(y.sKey);
const validQList = (z) =>
  Array.isArray(z) && z.length > 0 && z.every(checkProps);

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
        throw ` DynamoDB get (${pk}, ${sk}) failed with result ${result}. `;
      }
      return result;
    });
}

async function deleteDbItem(pk, sk) {
  return dynamo
    .delete({
      TableName,
      Key: {
        pk,
        sk,
      },
    })
    .promise();
}

exports.handler = async () => {
  try {
    const disciplinesData = await getDbItem(canId, "disciplines");
    const examId = disciplinesData?.disciplines[0];

    const examData = await getDbItem(examId, examId);

    const qList = examData?.qList;
    if (!validQList(qList)) {
      throw ` Invalid question list ${qList}. `;
    }

    qList.forEach(async (qObj) => {
      const pk = canId;
      const sk = qObj.pKey;
      await deleteDbItem(pk, sk);
      body += ` Deleting submissionData ${pk}, ${sk}. `;
    });

    await deleteDbItem(canId, examId);
    body += ` Deleting assessmentData ${canId}, ${examId}. `;

    //
    return { body };
  } catch (error) {
    const fault = ` λfn clear-test001-pine failed:- ${error.toString()} `;
    console.warn(fault);
    return {
      error: fault,
    };
  }
};
