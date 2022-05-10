const AWS = require("aws-sdk");
const getDbItemMod = require("./getDbItemMod");

exports.handler = async () => {
  const result = getDbItemMod.getDbItem;
  return { body: JSON.stringify(result) };
};
