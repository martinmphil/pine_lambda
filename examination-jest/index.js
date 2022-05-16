// // const AWS = require("aws-sdk");
// const getDbItemMod = require("./getDbItemMod");
// const timestamp = new Date().toISOString();
let fault = "";
// let qList = [];
// let qIndex = 0;

exports.handler = async (event) => {
  try {
    // const username = event.requestContext.authorizer.jwt.claims.username;
    // const examCode = event.pathParameters.idNbr;
    const examCode = "1";
    const username = "dummy_user";
    // to remove
    console.log(JSON.stringify(event) + " " + username);

    const canId = `candidate#${username}`;
    const examId = `exam#${examCode}`;

    const nextQHtml = `user is ${canId} and exam is ${examId}. `;

    return { body: JSON.stringify(nextQHtml) };
  } catch (err) {
    fault += ` Lambda fn examination-pine failed:- ${JSON.stringify(err)} `;
    return { error: fault };
  }
};
