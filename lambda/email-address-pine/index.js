const AWS = require("aws-sdk");

exports.handler = async function (event) {
  const AccessToken = event.headers.authorization;

  const cog = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18",
  });
  const cogUser = await cog.getUser({ AccessToken }).promise();
  const email = cogUser.UserAttributes.find((x) => x.Name === "email").Value;

  const response = {
    statusCode: 200,
    body: JSON.stringify(email),
  };
  return response;
};

