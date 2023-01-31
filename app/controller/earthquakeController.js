
const { download } = require("../../helper")
const { Earthquake } = require("../../models")
const { Op } = require("sequelize")
let { KNN } = require("../../Logic/index")

class earthquekeController {

  static async show(req, res) {
    let limit = !req.query.limit ? 7 : req.query.limit
    let Earthquakes = await Earthquake.findAll({ limit })
    res.send(Earthquakes)
  }

  static async add(req, res) {
    res.send(req.body)
  }

  //KNN
  static async KNN(req, res) {
    res.render("Earthquake/knn", { title: "KNN", css: "knn.css", js: null, result: null })
  }

  static async postKnn(req, res) {
    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'] })
    let data = []
    for (let gempa of Earthquakes) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }
    let atribut = ["kekuatanGempa", "kedalamanGempa", 'jarakGempa']
    let knn = new KNN(atribut, data)

    let datum = [+req.body.kekuatanGempa, +req.body.kedalamanGempa, +req.body.jarakGempa]
    let result = knn.Train(datum, 1)

    res.render("Earthquake/knn", { title: "KNN", css: "knn.css", js: null, result })
  }

  //Decision Tree
  static async DecicionTree(req, res) {
    res.render("Earthquake/decisiontree", { title: "DecisionTree", css: "decisiontree.css", js: null, result: null })
  }

  static async search(req, res) {
    let search = req.query.keyword
    let Earthquakes = await Earthquake.findAll({
      where: {
        [Op.or]: [
          {
            lokasi: {
              [Op.iLike]: `%${search}%`
            },
          },
          {
            dampakGempa: {
              [Op.iLike]: `%${search}%`
            },
          },
        ]
      }
    })
    res.send(Earthquakes)
  }

  static async unduh(req, res) {
    let Earthquakes = await Earthquake.findAll({ attributes: ["id", "lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'] })
    const fields = [
      {
        label: "No",
        value: "id"
      },
      {
        label: "Lokasi",
        value: "lokasi"
      },
      {
        label: "Kekuatan Gempa",
        value: "kekuatanGempa"
      },
      {
        label: "Kedalaman Gempa",
        value: "kedalamanGempa"
      },
      {
        label: "Jarak Pusat Gempa",
        value: "jarakGempa"
      },
      {
        label: "Dampak Gempa",
        value: "dampakGempa"
      }
    ]
    return download(res, 'dataGempaIndonesia.csv', fields, Earthquakes);
  }

}

module.exports = earthquekeController