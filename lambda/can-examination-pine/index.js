exports.handler = async (event) => {
  try {
    //const username = event.requestContext.authorizer.jwt.claims.username;
    const username = "dummy_user";
    console.log(event + " " + username);
    //
    //
    const canId = `candidate#${username}`;

    const nextQHtml = canId;

    return { body: JSON.stringify(nextQHtml) };
  } catch (err) {
    const fault = ` Lambda fn can-listings-pine failed:- ${JSON.stringify(
      err
    )} `;
    return { error: fault };
  }
};
