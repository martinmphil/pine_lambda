const { getDbItem } = require("./getDbItemMod");

async function getQText(pk, sk) {
  return getDbItem(pk, sk)
    .then((dbData) => dbData?.markup)
    .then((html) => {
      if (typeof html != "string" || html.length < 1) {
        throw ` Get-question-text failed for question ${pk}, ${sk}. `;
      } else {
        return html;
      }
    });
}

exports.getQText = getQText;
