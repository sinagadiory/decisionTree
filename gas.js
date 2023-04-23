const axios = require("axios")
const validator = require("validator")

function MatchDampakGempa(dirasakan) {
  let result = ""
  if (dirasakan.match("I") || dirasakan.match("II")) {
    result = "Not Felt"
  }
  if (dirasakan.match("III") || dirasakan.match("IV") || dirasakan.match("V")) {
    result = "Felt"
  }
  if (dirasakan.match("VI")) {
    result = "Slight Damage"
  }
  if (dirasakan.match("VII") || dirasakan.match("VIII")) {
    result = "Moderate Damage"
  }
  if (dirasakan.match("IX") || dirasakan.match("X") || dirasakan.match("XI") || dirasakan.match("XII")) {
    result = "Heavy Damage"
  }
  return result
}

function jarakGempa(data) {
  let result = []
  dataGempa.map((d) => {
    let check = d['Wilayah'].split(" ");
    check.map((c) => {
      if (c.match("km")) {
        let check1 = c.split("km")[0]
        if (validator.isNumeric(check1)) result.push(check1)
      };
      if (validator.isNumeric(c)) result.push(c)
    })
  })
  return [...result]
}

axios.get("https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json")
  .then(({ data }) => {
    let dataGempa = data.Infogempa.gempa
    let result = []
    dataGempa.map((d) => {
      let check = d['Wilayah'].split(" ");
      check.map((c) => {
        if (c.match("km")) {
          let check1 = c.split("km")[0]
          if (validator.isNumeric(check1)) result.push(+check1)
        };
        if (validator.isNumeric(c)) result.push(+c)
      })
    })
    console.log([...result]);
  })

