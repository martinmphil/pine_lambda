const { achieved } = require("./achievedMod");
const { getDbItem } = require("./getDbItemMod");
const { getQList } = require("./getQListMod");
const { putDbItem } = require("./putDbItemMod");

function validStr(x) {
  if (typeof x === "string" && x.length > 0) {
    return x;
  }
  return "";
}

function validateQRightAnswersArr(rubric) {
  if (rubric && Object.keys(rubric)) {
    return Object.keys(rubric);
  }
}

function markQ(rubricSubmission) {
  const candidateAnswer = validStr(rubricSubmission?.candidateAnswer);
  const qRightAnswersArr =
    validateQRightAnswersArr(rubricSubmission?.rubric) ?? [];
  if (qRightAnswersArr.includes(candidateAnswer)) {
    const result = rubricSubmission?.rubric?.[candidateAnswer] ?? 0;
    return parseFloat(result, 10) || 0;
  }
  return 0;
}

function markAwarded(rubricSubmissionArr) {
  let marksArr = [];
  if (rubricSubmissionArr && Array.isArray(rubricSubmissionArr)) {
    marksArr = rubricSubmissionArr.map((el) => {
      return markQ(el);
    });
  }
  const result = marksArr.reduce((acc, el) => acc + el, 0);
  return result ?? 0;
}

function totalMarksAvailable(rubricSubmissionArr) {
  if (!rubricSubmissionArr || !Array.isArray(rubricSubmissionArr)) {
    return 0;
  }
  return rubricSubmissionArr
    .filter((el) => el.rubric)
    .map((el) => {
      if (!Object.values(el.rubric)) {
        return 0;
      }
      return Math.max(...Object.values(el.rubric));
    })
    .filter((el) => !Number.isNaN(el))
    .reduce((acc, el) => acc + el, 0);
}

function gradeAwarded(mark, outOf) {
  if (
    !Number.isFinite(parseFloat(mark)) ||
    !Number.isFinite(parseFloat(outOf)) ||
    mark > outOf
  ) {
    return "";
  }
  const score = (mark / outOf) * 100;
  return score >= 70
    ? "Distinction"
    : score >= 60
    ? "Merit"
    : score >= 40
    ? "Pass"
    : score >= 20
    ? "Near Pass"
    : "Unclassified";
}

async function markExam(canId, examId, assessmentData) {
  // [{pKey:qText#1, sKey:intro}, ...]
  const qList = await getQList(examId);

  const qListRubric = Promise.all(
    qList.map(async (el) => {
      const rubric = await getDbItem(el.pKey, el.sKey).then(
        (Item) => Item?.rubric ?? {}
      );
      return { ...el, rubric };
    })
  );

  const rubricSubmissionArr = await Promise.all(
    (
      await qListRubric
    ).map(async (el) => {
      const candidateAnswer = await getDbItem(canId, el.pKey).then((Item) => {
        return Item?.candidateAnswer ?? "";
      });
      return { ...el, candidateAnswer };
    })
  );

  const mark = markAwarded(rubricSubmissionArr);

  const outOf = totalMarksAvailable(rubricSubmissionArr);

  const grade = gradeAwarded(mark, outOf);

  const timestamp = new Date().toISOString();

  const putParamObj = {
    TableName: "pine",
    Item: { ...assessmentData, updatedAt: timestamp, mark, outOf, grade },
    ConditionExpression: "attribute_exists(pk)",
  };

  await putDbItem(putParamObj);

  return achieved(mark, outOf, grade);
}

exports.markExam = markExam;
