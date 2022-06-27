const { putDbItem } = require("./putDbItemMod");

const timestamp = new Date().toISOString();

async function initSubmission(canId, qTextId) {
  const putParamObj = {
    TableName: "pine",
    Item: {
      pk: canId,
      sk: qTextId,
      entityType: "submissionData",
      createdAt: timestamp,
    },
    ConditionExpression: "attribute_not_exists(pk)",
  };
  return putDbItem(putParamObj);
}

exports.initSubmission = initSubmission;

// for unit test
exports.putDbItem = putDbItem;
