
const { Earthquake } = require("../../models")
let { KNN, splitValidation, crossValidation, DTC45, Clustering } = require("../../Logic/index")
const ss = require("simple-statistics")

class visualController {
  static async barCategory(req, res) {
    res.render("Visual/category", { title: "Visual Bar Char", js: "visualcategory.js", css: "visualcategory.css" })
  }

  static async statistic(req, res) {
    const Earthquakes = await Earthquake.findAll({ order: [['id', 'ASC']] })
    const kekuatanGempa = []
    const kedalamanGempa = []
    const jarakGempa = []

    for (let d of Earthquakes) {
      kekuatanGempa.push(d['kekuatanGempa'])
      kedalamanGempa.push(d['kedalamanGempa'])
      jarakGempa.push(d['jarakGempa'])
    }
    res.render("Visual/statistic", { title: "Statistics", js: "statistic.js", css: "statistic.css", ss, kekuatanGempa, kedalamanGempa, jarakGempa })
  }
}

module.exports = visualController