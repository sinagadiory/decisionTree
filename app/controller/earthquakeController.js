
const { download } = require("../../helper")
const { Earthquake } = require("../../models")
const { Op } = require("sequelize")
let { KNN, splitValidation, crossValidation } = require("../../Logic/index")

class earthquekeController {

  static async show(req, res) {
    let limit = !req.query.limit ? 7 : req.query.limit
    let Earthquakes = await Earthquake.findAll({ limit, order: [['id', 'ASC']] })
    res.send(Earthquakes)
  }

  static async update(req, res) {
    const { id } = req.params
    let gempa = await Earthquake.findOne({ where: { id } })
    if (!gempa) {
      res.redirect("/home")
      return
    }
    res.render("Earthquake/update", { title: "Update", css: "update.css", js: null, data: gempa, success: false, error: null })
  }

  static async postUpdate(req, res) {
    const { id } = req.params
    const { lokasi, kekuatanGempa, kedalamanGempa, jarakGempa, dampakGempa } = req.body
    try {
      let gempa = await Earthquake.findOne({ where: { id } })
      if (!gempa) {
        res.redirect("/home")
        return
      }
      await Earthquake.update({ lokasi, kekuatanGempa: +kekuatanGempa, kedalamanGempa: +kedalamanGempa, jarakGempa: +jarakGempa, dampakGempa }, { where: { id } })
      gempa = await Earthquake.findOne({ where: { id } })
      res.render("Earthquake/update", { title: "Update", css: "update.css", js: null, data: gempa, success: true, error: null })
    } catch (error) {
      let gempa = await Earthquake.findOne({ where: { id } })
      res.render("Earthquake/update", { title: "Update", css: "update.css", js: null, data: gempa, success: false, error: error.errors[0].message })
    }
  }

  static async add(req, res) {
    res.send(req.body)
  }

  //KNN
  static async KNN(req, res) {
    res.render("Earthquake/knn", { title: "KNN", css: "knn.css", js: null, result: null, data: null })
  }

  static async postKnn(req, res) {
    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], order: [['id', 'ASC']] })
    let data = []
    for (let gempa of Earthquakes) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }
    let atribut = ["kekuatanGempa", "kedalamanGempa", 'jarakGempa']
    let knn = new KNN(atribut, data)

    let datum = [+req.body.kekuatanGempa, +req.body.kedalamanGempa, +req.body.jarakGempa]
    let result = knn.Train(datum, +req.body.k)

    res.render("Earthquake/knn", { title: "KNN", css: "knn.css", js: null, result, data: req.body })
  }

  static async evaluasiModel(req, res) {
    let rasio = !req.query.rasio ? 8 : +req.query.rasio

    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], order: [['id', 'ASC']] })
    let split = new splitValidation()
    let { dataTraning, dataTesting } = split.runSplitValidation(Earthquakes, rasio)

    let data = []
    for (let gempa of dataTraning) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }
    let dataTest = []

    for (let gempa of dataTesting) {
      dataTest.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }

    let atribut = ["kekuatanGempa", "kedalamanGempa", 'jarakGempa']
    let knn = new KNN(atribut, data)

    let prediksi = (knn.accuracy(dataTest)).toFixed(2)

    for (let i = 0; i < dataTest.length; i++) {
      let prediksi = knn.Train(dataTest[i].slice(1, dataTest[i].length - 1), 3)
      dataTesting[i] = { lokasi: dataTesting[i].lokasi, kekuatanGempa: dataTesting[i].kekuatanGempa, kedalamanGempa: dataTesting[i].kedalamanGempa, jarakGempa: dataTesting[i].jarakGempa, dampakGempa: dataTesting[i].dampakGempa, prediksi }
    }

    let benar = 0
    let salah = 0
    dataTesting.map((e) => {
      if (e.dampakGempa === e.prediksi) {
        benar += 1
      } else {
        salah += 1
      }
    })


    res.render("Earthquake/splitValidation", { title: "Split Validation", css: "index.css", js: null, result: null, dataTraning, dataTesting, benar, salah, prediksi })
  }

  static async evaluasiModelCrossValidation(req, res) {
    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], order: [['id', 'ASC']] })
    let CV = new crossValidation()
    let data = CV.runCrossValidation(Earthquakes, 8)
    let atribut = ["kekuatanGempa", "kedalamanGempa", 'jarakGempa']

    let rata2 = [] //for rata2
    let Databenar = []
    let Datasalah = []

    for (let i = 0; i < data.length; i++) {
      let { dataTraning, dataTesting } = CV.splitCrossValidation(data, i)
      let dataTrain = []
      for (let gempa of dataTraning) {
        dataTrain.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
      }
      let dataTest = []

      for (let gempa of dataTesting) {
        dataTest.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
      }
      let knn = new KNN(atribut, dataTrain)
      rata2[i] = +knn.accuracy(dataTest).toFixed(2)

      for (let j = 0; j < dataTest.length; j++) {
        let prediksi = knn.Train(dataTest[j].slice(1, dataTest[j].length - 1), 3)
        data[i][j] = { lokasi: data[i][j].lokasi, kekuatanGempa: data[i][j].kekuatanGempa, kedalamanGempa: data[i][j].kedalamanGempa, jarakGempa: data[i][j].jarakGempa, dampakGempa: data[i][j].dampakGempa, prediksi }
        // let benar = 0
        // let salah = 0
        // data[i][j].map((e) => {
        //   if (e.dampakGempa === e.prediksi) {
        //     benar += 1
        //   } else {
        //     salah += 1
        //   }
        // })
      }
    }

    // return res.send(data)

    for (let z = 0; z < data.length; z++) {
      data[z] = [...data[z], rata2[z]]
    }

    res.render("Earthquake/crossValidation", { title: "Cross Validation", css: "index.css", js: null, data })
  }


  static async tableKnn(req, res) {
    let limit = !req.query.limit ? 7 : req.query.limit
    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], limit, order: [['id', 'ASC']] })

    let data = []
    for (let gempa of Earthquakes) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }

    let atribut = ["kekuatanGempa", "kedalamanGempa", 'jarakGempa']
    let knn = new KNN(atribut, data)

    let prediksi = (knn.accuracy(data)).toFixed(2)

    for (let i = 0; i < data.length; i++) {
      let prediksi = knn.Train(data[i].slice(1, data[i].length - 1), 3)
      Earthquakes[i] = { lokasi: Earthquakes[i].lokasi, kekuatanGempa: Earthquakes[i].kekuatanGempa, kedalamanGempa: Earthquakes[i].kedalamanGempa, jarakGempa: Earthquakes[i].jarakGempa, dampakGempa: Earthquakes[i].dampakGempa, prediksi }
    }
    let benar = 0
    let salah = 0
    Earthquakes.map((e) => {
      if (e.dampakGempa === e.prediksi) {
        benar += 1
      } else {
        salah += 1
      }
    })

    res.render("Earthquake/tableKnn", { title: "TableKNN", css: "index.css", js: "tableKnn.js", data: Earthquakes, prediksi, benar, salah })
  }

  static async unduhTableKnn(req, res) {
    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], order: [['id', 'ASC']] })
    let data = []
    for (let gempa of Earthquakes) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }
    let atribut = ["kekuatanGempa", "kedalamanGempa", 'jarakGempa']
    let knn = new KNN(atribut, data)
    for (let i = 0; i < data.length; i++) {
      let result = knn.Train(data[i], 1)
      Earthquakes[i].prediksi = result
    }
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
      },
      {
        label: "Prediksi",
        value: "prediksi"
      }
    ]
    return download(res, 'TabelKnn.csv', fields, Earthquakes);
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
    let Earthquakes = await Earthquake.findAll({ attributes: ["id", "lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], order: [['id', 'ASC']] })
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