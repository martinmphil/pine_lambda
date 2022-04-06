const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "pine";

const examNamePromise = (examId) => {
  return dynamo
    .get({
      TableName,
      Key: {
        pk: examId,
        sk: examId,
      },
    })
    .promise()
    .then((x) => {
      return x?.Item?.name ?? examId;
    })
    .catch((err) => {
      console.warn(
        ` get exam-name for ${examId} failed:- ${JSON.stringify(err)} `
      );
      throw err;
    });
};

const examArrPromise = (canId, entityType) => {
  return dynamo
    .get({
      TableName,
      Key: {
        pk: canId,
        sk: entityType,
      },
    })
    .promise()
    .then((x) => {
      return x?.Item?.arr ?? [];
    })
    .catch((err) => {
      console.warn(
        ` get ${entityType} exams-arry for ${canId} failed:- ${JSON.stringify(
          err
        )} `
      );
      throw err;
    });
};

const ongoingPromise = (canId) => {
  return examArrPromise(canId, "ongoing")
    .then(async (examIdArr) => {
      return Promise.all(
        examIdArr.map(async (examId) => {
          const examName = await examNamePromise(examId);
          return `<li><a href="/exams/${examId}">${examName}</a></li>`;
        })
      );
    })
    .then((listingsArr) => {
      if (Array.isArray(listingsArr) === false || listingsArr.length === 0) {
        return "";
      }
      const ul = `<ul>${listingsArr.join(" ")}</ul>`;
      return `<article class="ongoing"><h1>Onging</h1>${ul}</article><hr />`;
    })
    .catch((err) => {
      console.warn(
        ` Get ongoing-exams-HTML for ${canId} failed:- ${JSON.stringify(err)} `
      );
      throw err;
    });
};

const upcomingPromise = (canId) => {
  return examArrPromise(canId, "upcoming")
    .then(async (examIdArr) => {
      return Promise.all(
        examIdArr.map(async (examId) => {
          const examName = await examNamePromise(examId);
          return `<li><a href="/exams/${examId}">${examName}</a></li>`;
        })
      );
    })
    .then((listingsArr) => {
      if (Array.isArray(listingsArr) === false || listingsArr.length === 0) {
        return "";
      }
      const ul = `<ul>${listingsArr.join(" ")}</ul>`;
      return `<article class="upcoming"><h1>Upcoming</h1>${ul}</article><hr />`;
    })
    .catch((err) => {
      console.warn(
        ` Get upcoming-exams-HTML for ${canId} failed:- ${JSON.stringify(err)} `
      );
      throw err;
    });
};

const achievedPromise = (canId) => {
  return examArrPromise(canId, "achieved")
    .then(async (examIdArr) => {
      return Promise.all(
        examIdArr.map(async (examId) => {
          const examName = await examNamePromise(examId);
          return `<li><a href="/achieved/${examId}">${examName}</a></li>`;
        })
      );
    })
    .then((listingsArr) => {
      if (Array.isArray(listingsArr) === false || listingsArr.length === 0) {
        return "";
      }
      const ul = `<ul>${listingsArr.join(" ")}</ul>`;
      return `<article class="achieved"><h1>Achieved</h1>${ul}</article><hr />`;
    })
    .catch((err) => {
      console.warn(
        ` Get achieved-exams-HTML for ${canId} failed:- ${JSON.stringify(err)} `
      );
      throw err;
    });
};

exports.handler = async (event) => {
  try {
    const username = event.requestContext.authorizer.jwt.claims.username;
    const canId = `candidate#${username}`;

    const ongoing = await ongoingPromise(canId);
    const upcoming = await upcomingPromise(canId);
    const achieved = await achievedPromise(canId);

    if (ongoing + upcoming + achieved === "") {
      return {
        body: JSON.stringify(
          "<p> If you expected to find your enrolled subjects here, then please contact your Administrator. </p>"
        ),
      };
    }

    const subjectHtmlListings = `${ongoing} ${upcoming} ${achieved}`;

    return { body: JSON.stringify(subjectHtmlListings) };
  } catch (err) {
    return {
      error: ` Lambda fn can-listings-pine failed:- ${JSON.stringify(err)} `,
    };
  }
};
