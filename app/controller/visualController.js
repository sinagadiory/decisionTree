
const { Earthquake } = require("../../models")
let { KNN, splitValidation, crossValidation, DTC45, Clustering } = require("../../Logic/index")
const ss = require("simple-statistics")

class visualController {
  static async barCategory(req, res) {
    res.render("Visual/category", { title: "Visual Category", js: "visualcategory.js", css: "visualcategory.css" })
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
    // return res.send({ nilai: ss.quantile(jarakGempa, 0.75) })
    res.render("Visual/statistic", { title: "Statistics", js: "statistic.js", css: "statistic.css", ss, kekuatanGempa, kedalamanGempa, jarakGempa })
  }

  static async VisualConfusionMatrix(req, res) {


    res.render("Visual/Matrix", { title: "Compare Model Split Validation", js: "matrix.js", css: "visualcategory.css" })
  }

  static async VisualConfusionMatrixCV(req, res) {
    let k = !req.query.k ? 10 : req.query.k
    if (k < 2 || k > 15) return res.redirect("/confusionmatrix/performa/crossvalidation")
    res.render("Visual/MatrixCV", { title: "Compare Model Cross Validation", js: "matrixCV.js", css: "visualcategory.css", panjang: k })
  }
}

module.exports = visualController