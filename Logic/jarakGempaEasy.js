const validator = require("validator")

function jarakGempa(data) {
  let result = []
  data.map((d) => {
    let check = d['Wilayah'].split(" ");
    check.map((c) => {
      if (c.match("km")) {
        let check1 = c.split("km")[0]
        if (validator.isNumeric(check1)) result.push(+check1)
      };
      if (validator.isNumeric(c)) result.push(+c)
    })
  })
  return [...result]
}

module.exports = jarakGempa