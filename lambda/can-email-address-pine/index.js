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

      if (typeof email === "string" && email.length > 0) {
        return email;
      } else {
        throw " Cognito user absent. ";
      }
    })
    .catch((error) => {
      const fault = ` Get cognito user failed:- ${error.toString()} `;
      console.warn(fault);
      throw fault;
    });
};

exports.handler = async function (event) {
  try {
    const AccessToken = event?.headers?.authorization;
    let email = "";

    if (typeof AccessToken === "string" && AccessToken.length > 0) {
      email = await emailPromise(AccessToken);
    } else {
      throw " Failed to get-email-address because access-token missing. ";
    }
    return { body: JSON.stringify(email) };
  } catch (error) {
    const fault = ` Lambda can-email-address-pine failed:- ${error.toString()} `;
    console.warn(fault);
    return {
      error: fault,
    };
  }
};
