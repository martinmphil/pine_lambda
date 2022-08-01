const AWS = require("aws-sdk");
const cog = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
});

const emailPromise = (AccessToken) => {
  return cog
    .getUser({ AccessToken })
    .promise()
    .then((cogUser) => {
      const email = cogUser?.UserAttributes.find(
        (x) => x.Name === "email"
      )?.Value;

      if (typeof email === "string" && email.length > 1) {
        return email;
      }

      throw " Cognito user absent. ";
    });
};

exports.handler = async function (event) {
  try {
    const AccessToken = event?.headers?.authorization;
    let body = "";

    if (typeof AccessToken === "string" && AccessToken.length > 0) {
      body = await emailPromise(AccessToken);
      return { body };
    }

    throw " Access-token missing from get-email-address. ";
  } catch (error) {
    const fault = ` Lambda can-email-address-pine failed:- ${error.toString()} `;
    console.warn(fault);
    return {
      error: fault,
    };
  }
};
