const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

function validStr(x) {
  if (typeof x === "string" && x.length > 0) {
    return true;
  } else {
    return false;
  }
}

function validTableName(obj) {
  if (obj.TableName && validStr(obj.TableName)) {
    return true;
  } else {
    throw ` Missing table-name for putDbItem ${JSON.stringify(obj)}. `;
  }
}

function validPk(obj) {
  if (obj.Item.pk && validStr(obj.Item.pk)) {
    return true;
  } else {
    throw ` Missing partition-key for putDbItem ${JSON.stringify(obj)}. `;
  }
}

function validSk(obj) {
  if (obj.Item.sk && validStr(obj.Item.sk)) {
    return true;
  } else {
    throw ` Missing sort-key for putDbItem ${JSON.stringify(obj)}. `;
  }
}

async function putDbItem(putParamObj) {
  if (
    validTableName(putParamObj) &&
    validPk(putParamObj) &&
    validSk(putParamObj)
  ) {
    return dynamo.put(putParamObj).promise();
  } else {
    throw ` Failed putDbItem with ${JSON.stringify(putParamObj)}. `;
  }
}

exports.putDbItem = putDbItem;

// for unit test
exports.dynamo = dynamo;
