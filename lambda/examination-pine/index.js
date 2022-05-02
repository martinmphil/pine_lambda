exports.handler = async (event) => {
  try {
    //const username = event.requestContext.authorizer.jwt.claims.username;
    const username = "dummy_user";
    console.log(JSON.stringify(event) + " " + username);
    //
    //
    const canId = `candidate#${username}`;

    const idNbr = event.pathParameters.idNbr;

    const nextQHtml = `user ${canId} has exam idNbr of ${idNbr}`;

    return { body: JSON.stringify(nextQHtml) };
  } catch (err) {
    const fault = ` Lambda fn examination-pine failed:- ${JSON.stringify(
      err
    )} `;
    return { error: fault };
  }
};
