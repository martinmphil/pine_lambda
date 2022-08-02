const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "pine";

async function examName(examId) {
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
    });
}

async function getDisciplines(canId) {
  return dynamo
    .get({
      TableName,
      Key: {
        pk: canId,
        sk: "disciplines",
      },
    })
    .promise()
    .then((x) => {
      return x?.Item?.disciplines ?? [];
    });
}

async function getProgression(canId, examId) {
  return dynamo
    .get({
      TableName,
      Key: {
        pk: canId,
        sk: examId,
      },
    })
    .promise()
    .then((x) => {
      return x?.Item?.qIndex ?? 0;
    })
    .then((qIndex) => {
      let progression = "upcoming";
      if (qIndex > 0) {
        progression = "ongoing";
      }
      if (qIndex < 0) {
        progression = "achieved";
      }
      return progression;
    });
}

async function getListings(canId) {
  return getDisciplines(canId).then(async (examIdArr) => {
    return Promise.all(
      examIdArr.map(async (examId) => {
        const name = await examName(examId);
        const progression = await getProgression(canId, examId);
        return { examId, name, progression };
      })
    );
  });
}

function validListingsArr(arr) {
  if (
    Array.isArray(arr) &&
    arr.length &&
    arr.every(
      (el) =>
        el.examId &&
        el.examId.length &&
        el.name &&
        el.name.length &&
        el.progression &&
        (el.progression === "ongoing" ||
          el.progression === "upcoming" ||
          el.progression === "achieved")
    )
  ) {
    return true;
  } else {
    return false;
  }
}

function listingHtml(examId, examName) {
  return `<button type="button" class="discipline" id="${examId}">${examName}</button>`;
}

function formatOngoing(arr) {
  const articleArr = arr.filter((x) => x.progression === "ongoing");
  if (articleArr.length === 0) {
    return "";
  }
  const listingsArr = articleArr.map((el) => {
    return listingHtml(el.examId, el.name);
  });
  return `<article class="ongoing"><h1>Onging</h1>${listingsArr.join(
    " "
  )}</article><hr />`;
}

function formatUpcoming(arr) {
  const articleArr = arr.filter((x) => x.progression === "upcoming");
  if (articleArr.length === 0) {
    return "";
  }
  const listingsArr = articleArr.map((el) => {
    return listingHtml(el.examId, el.name);
  });
  return `<article class="upcoming"><h1>Upcoming</h1>${listingsArr.join(
    " "
  )}</article><hr />`;
}

function formatAchieved(arr) {
  const articleArr = arr.filter((x) => x.progression === "achieved");
  if (articleArr.length === 0) {
    return "";
  }
  const listingsArr = articleArr.map((el) => {
    return listingHtml(el.examId, el.name);
  });
  return `<article class="achieved"><h1>Achieved</h1>${listingsArr.join(
    " "
  )}</article><hr />`;
}

exports.handler = async (event) => {
  try {
    const username = event.requestContext.authorizer.jwt.claims.username;
    const canId = `candidate#${username}`;

    let body = "";
    let listings = [];
    listings = await getListings(canId);

    if (validListingsArr(listings)) {
      const instruct = "<p>Please pick your subject</p>";
      const ongoing = formatOngoing(listings);
      const upcoming = formatUpcoming(listings);
      const achieved = formatAchieved(listings);
      body = `${instruct} ${ongoing} ${upcoming} ${achieved}`;
      return { body };
    }

    body =
      "<p> If you expected to find your enrolled subjects here, then please contact your Administrator. </p>";
    return { body };
  } catch (error) {
    const fault = ` Lambda fn can-listings-pine failed:- ${error.toString()} `;
    return { error: fault };
  }
};
