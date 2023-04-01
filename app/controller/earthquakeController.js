
const { download, simpanganBaku } = require("../../helper")
const { Earthquake } = require("../../models")
const { Op } = require("sequelize")
const { userService } = require("../service")
let { KNN, splitValidation, crossValidation, DTC45, Clustering, Matrix } = require("../../Logic/index")

class earthquekeController {

  static async show(req, res) {
    let limit = !req.query.limit ? 7 : req.query.limit
    let { type = "Not Category" } = req.query
    let Earthquakes = await Earthquake.findAll({ limit, order: [['id', 'ASC']] })
    let data = []
    for (let gempa of Earthquakes) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }

    let kekuatanGempa = []
    let kedalamanGempa = []
    let jarakGempa = []

    for (let d of data) {
      kekuatanGempa.push(+d[1])
      kedalamanGempa.push(+d[2])
      jarakGempa.push(+d[3])
      d[1] = +d[1]
      d[2] = +d[2]
      d[3] = +d[3]
    }
    //Kategori
    let kategoriKekuatan = ["lemah", 'sedang', 'kuat']
    let kategoriKedalaman = ['dangkal', 'sedang', 'dalam']
    let kategoriJarakGempa = ['dekat', 'sedang', 'jauh']

    let cluster = new Clustering()
    //Cluster
    let clusterKekuatan = cluster.kMeans(kekuatanGempa, kategoriKekuatan.length)
    let clusterKedalaman = cluster.kMeans(kedalamanGempa, kategoriKedalaman.length)
    let clusterJarakGempa = cluster.kMeans(jarakGempa, kategoriJarakGempa.length)

    if (type === 'Category') {
      for (let gempa of Earthquakes) {
        gempa['kekuatanGempa'] = kategoriKekuatan[cluster.findCluster(gempa['kekuatanGempa'], clusterKekuatan.centroids)]
        gempa['kedalamanGempa'] = kategoriKedalaman[cluster.findCluster(gempa['kedalamanGempa'], clusterKedalaman.centroids)]
        gempa['jarakGempa'] = kategoriJarakGempa[cluster.findCluster(gempa['jarakGempa'], clusterJarakGempa.centroids)]
      }
    }
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
    let { type = "Not Category" } = req.query
    let Earthquakes = await Earthquake.findAll({ limit: 7, order: [['id', 'ASC']] })
    let data = []
    for (let gempa of Earthquakes) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }

    let kekuatanGempaData = []
    let kedalamanGempaData = []
    let jarakGempaData = []

    for (let d of data) {
      kekuatanGempaData.push(+d[1])
      kedalamanGempaData.push(+d[2])
      jarakGempaData.push(+d[3])
      d[1] = +d[1]
      d[2] = +d[2]
      d[3] = +d[3]
    }
    //Kategori
    let kategoriKekuatan = ["lemah", 'sedang', 'kuat']
    let kategoriKedalaman = ['dangkal', 'sedang', 'dalam']
    let kategoriJarakGempa = ['dekat', 'sedang', 'jauh']

    let cluster = new Clustering()
    //Cluster
    let clusterKekuatan = cluster.kMeans(kekuatanGempaData, kategoriKekuatan.length)
    let clusterKedalaman = cluster.kMeans(kedalamanGempaData, kategoriKedalaman.length)
    let clusterJarakGempa = cluster.kMeans(jarakGempaData, kategoriJarakGempa.length)

    if (type === 'Category') {
      for (let gempa of Earthquakes) {
        gempa['kekuatanGempa'] = kategoriKekuatan[cluster.findCluster(gempa['kekuatanGempa'], clusterKekuatan.centroids)]
        gempa['kedalamanGempa'] = kategoriKedalaman[cluster.findCluster(gempa['kedalamanGempa'], clusterKedalaman.centroids)]
        gempa['jarakGempa'] = kategoriJarakGempa[cluster.findCluster(gempa['jarakGempa'], clusterJarakGempa.centroids)]
      }
    }
    let user = await userService.findUser(req.user.email)
    if (user.status !== 'active') {
      res.clearCookie("access_token")
      res.redirect("/admin/login")
      return
    }
    const { lokasi, kekuatanGempa, kedalamanGempa, jarakGempa, dampakGempa } = req.body
    try {
      let response = await Earthquake.create({ lokasi, kekuatanGempa, kedalamanGempa, jarakGempa, dampakGempa })
      if (response) {
        res.render("home", { title: "Home", user, data: Earthquakes, css: "home.css", error: true, input: req.body, js: 'home.js' })
      }
    } catch (error) {
      let err = error.errors[0].message
      // res.render("home", { title: "Home", css: "home.css", user, data: Earthquakes, js: "home.js" })
      res.render("home", { title: "Home", user, data: Earthquakes, css: "home.css", error: err, input: req.body, js: 'home.js' })
    }
  }

  //KNN
  static async KNN(req, res) {
    res.render("Earthquake/knn", { title: "KNN", css: "knn.css", js: "knn.js", result: null, data: null })
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

    setTimeout(() => {
      res.render("Earthquake/knn", { title: "KNN", css: "knn.css", js: "knn.js", result, data: req.body })
    }, 1500)
  }

  //KNN
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


    res.render("Earthquake/splitValidation", { title: "Split Validation KNN", css: "index.css", js: null, result: null, dataTraning, dataTesting, benar, salah, prediksi })
  }

  //Decision Tree
  static async splitValidationDT(req, res) {

    let rasio = !req.query.rasio ? 8 : +req.query.rasio
    let algo = !req.query.algo ? true : (req.query.algo === 'id3' ? false : true)

    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], order: [['id', 'ASC']] })
    let split = new splitValidation()
    let { dataTraning, dataTesting } = split.runSplitValidation(Earthquakes, rasio)

    let data = []

    for (let gempa of dataTraning) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }
    let dataTest = []
    let dataTest1 = [] // for confusion matrix

    for (let gempa of dataTesting) {
      dataTest1.push([gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
      dataTest.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }
    let kekuatanGempa = []
    let kedalamanGempa = []
    let jarakGempa = []
    for (let d of data) {
      kekuatanGempa.push(+d[1])
      kedalamanGempa.push(+d[2])
      jarakGempa.push(+d[3])
      d[1] = +d[1]
      d[2] = +d[2]
      d[3] = +d[3]
    }
    //Kategori
    let kategoriKekuatan = ["lemah", 'sedangK', 'kuat']
    let kategoriKedalaman = ['dangkal', 'sedangD', 'dalam']
    let kategoriJarakGempa = ['dekat', 'sedangJ', 'jauh']

    let cluster = new Clustering()
    //Cluster
    let clusterKekuatan = cluster.kMeans(kekuatanGempa, kategoriKekuatan.length)
    let clusterKedalaman = cluster.kMeans(kedalamanGempa, kategoriKedalaman.length)
    let clusterJarakGempa = cluster.kMeans(jarakGempa, kategoriJarakGempa.length)

    for (let d of data) {
      d[1] = kategoriKekuatan[cluster.findCluster(d[1], clusterKekuatan.centroids)]
      d[2] = kategoriKedalaman[cluster.findCluster(d[2], clusterKedalaman.centroids)]
      d[3] = kategoriJarakGempa[cluster.findCluster(d[3], clusterJarakGempa.centroids)]
    }
    for (let d of dataTest1) {
      d[0] = kategoriKekuatan[cluster.findCluster(d[0], clusterKekuatan.centroids)]
      d[1] = kategoriKedalaman[cluster.findCluster(d[1], clusterKedalaman.centroids)]
      d[2] = kategoriJarakGempa[cluster.findCluster(d[2], clusterJarakGempa.centroids)]
    }

    //Algoritma Decision Tree
    let atribut = ["kekuatanGempa", "kedalamanGempa", 'jarakGempa'] //Atribut
    let faktor = [1, 2, 3]
    const Decision = new DTC45(atribut, data)
    const tree = Decision.BuildTree(data, faktor, algo)
    const Model = (kasus) => { return Decision.predict(tree, kasus) }

    const matrix = new Matrix(dataTest1, Model)

    for (let i = 0; i < dataTest.length; i++) {
      let kasus = [kategoriKekuatan[cluster.findCluster(dataTesting[i]['kekuatanGempa'], clusterKekuatan.centroids)], kategoriKedalaman[cluster.findCluster(dataTesting[i]['kedalamanGempa'], clusterKedalaman.centroids)], kategoriJarakGempa[cluster.findCluster(dataTesting[i]['jarakGempa'], clusterJarakGempa.centroids)]]

      let prediksi = Decision.predict(tree, kasus)

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


    res.render("Earthquake/splitValidationDT", { title: "Split Validation Decision Tree", css: "index.css", js: null, result: null, dataTraning, dataTesting, benar, salah, prediksi: ((benar / (benar + salah)) * 100).toFixed(2), matrix })
  }

  //Decision Tree
  static async evaluasiModelCrossValidationDT(req, res) {
    let k = !req.query.k ? 10 : req.query.k
    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], order: [['id', 'ASC']] })
    let CV = new crossValidation()
    let data = CV.runCrossValidation(Earthquakes, k)

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

      let kekuatanGempa = []
      let kedalamanGempa = []
      let jarakGempa = []
      for (let d of dataTrain) {
        kekuatanGempa.push(+d[1])
        kedalamanGempa.push(+d[2])
        jarakGempa.push(+d[3])
        d[1] = +d[1]
        d[2] = +d[2]
        d[3] = +d[3]
      }
      //Kategori
      let kategoriKekuatan = ["lemah", 'sedangK', 'kuat']
      let kategoriKedalaman = ['dangkal', 'sedangD', 'dalam']
      let kategoriJarakGempa = ['dekat', 'sedangJ', 'jauh']

      let cluster = new Clustering()
      //Cluster
      let clusterKekuatan = cluster.kMeans(kekuatanGempa, kategoriKekuatan.length)
      let clusterKedalaman = cluster.kMeans(kedalamanGempa, kategoriKedalaman.length)
      let clusterJarakGempa = cluster.kMeans(jarakGempa, kategoriJarakGempa.length)

      for (let d of dataTrain) {
        d[1] = kategoriKekuatan[cluster.findCluster(d[1], clusterKekuatan.centroids)]
        d[2] = kategoriKedalaman[cluster.findCluster(d[2], clusterKedalaman.centroids)]
        d[3] = kategoriJarakGempa[cluster.findCluster(d[3], clusterJarakGempa.centroids)]
      }

      //Algoritma Decision Tree
      let atribut = ["kekuatanGempa", "kedalamanGempa", 'jarakGempa'] //Atribut
      let faktor = [1, 2, 3]
      const Decision = new DTC45(atribut, dataTrain)
      const tree = Decision.BuildTree(dataTrain, faktor)

      for (let j = 0; j < dataTest.length; j++) {
        let kasus = [kategoriKekuatan[cluster.findCluster(dataTest[j][1], clusterKekuatan.centroids)], kategoriKedalaman[cluster.findCluster(dataTest[j][2], clusterKedalaman.centroids)], kategoriJarakGempa[cluster.findCluster(dataTest[j][3], clusterJarakGempa.centroids)]]
        let prediksi = Decision.predict(tree, kasus)

        data[i][j] = { lokasi: data[i][j].lokasi, kekuatanGempa: data[i][j].kekuatanGempa, kedalamanGempa: data[i][j].kedalamanGempa, jarakGempa: data[i][j].jarakGempa, dampakGempa: data[i][j].dampakGempa, prediksi }
      }

      let benar = 0
      let salah = 0
      data[i].map((e) => {
        if (e.dampakGempa === e.prediksi) {
          benar += 1
        } else {
          salah += 1
        }
      })
      Databenar[i] = benar
      Datasalah[i] = salah
      rata2[i] = +((benar / (benar + salah)) * 100).toFixed(2)
    }

    for (let z = 0; z < data.length; z++) {
      data[z] = [+Databenar[z], +Datasalah[z], +rata2[z], ...data[z]]
    }

    const sum = rata2.reduce((partialSum, a) => partialSum + a, 0);

    res.render("Earthquake/CVDT", { title: "Cross Validation Decision Tree", css: "index.css", js: "crossValidationDT.js", data, rata: (sum / (rata2.length)).toFixed(2), simpanganBaku: simpanganBaku(rata2) })

  }

  //KNN
  static async evaluasiModelCrossValidation(req, res) {
    let k = !req.query.k ? 10 : req.query.k
    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], order: [['id', 'ASC']] })
    let CV = new crossValidation()
    let data = CV.runCrossValidation(Earthquakes, k)
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
      }
      let benar = 0
      let salah = 0
      data[i].map((e) => {
        if (e.dampakGempa === e.prediksi) {
          benar += 1
        } else {
          salah += 1
        }
      })
      Databenar[i] = benar
      Datasalah[i] = salah
    }

    for (let z = 0; z < data.length; z++) {
      data[z] = [+Databenar[z], +Datasalah[z], +rata2[z], ...data[z]]
    }

    const sum = rata2.reduce((partialSum, a) => partialSum + a, 0);
    res.render("Earthquake/crossValidation", { title: "Cross Validation KNN", css: "index.css", js: "crossValidation.js", data, rata: (sum / (rata2.length)).toFixed(2), simpanganBaku: simpanganBaku(rata2) })
  }

  //Table Decision Tree
  static async tableDecisionTree(req, res) {
    let limit = req.query.limit ?? 7
    let algo = !req.query.algo ? true : (req.query.algo === 'id3' ? false : true)

    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], order: [['id', 'ASC']], limit })
    let data = []
    for (let gempa of Earthquakes) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }

    let kekuatanGempa = []
    let kedalamanGempa = []
    let jarakGempa = []
    for (let d of data) {
      kekuatanGempa.push(+d[1])
      kedalamanGempa.push(+d[2])
      jarakGempa.push(+d[3])
      d[1] = +d[1]
      d[2] = +d[2]
      d[3] = +d[3]
    }
    //Kategori
    let kategoriKekuatan = ["lemah", 'sedangK', 'kuat']
    let kategoriKedalaman = ['dangkal', 'sedangD', 'dalam']
    let kategoriJarakGempa = ['dekat', 'sedangJ', 'jauh']

    let cluster = new Clustering()
    //Cluster
    let clusterKekuatan = cluster.kMeans(kekuatanGempa, kategoriKekuatan.length)
    let clusterKedalaman = cluster.kMeans(kedalamanGempa, kategoriKedalaman.length)
    let clusterJarakGempa = cluster.kMeans(jarakGempa, kategoriJarakGempa.length)

    for (let d of data) {
      d[1] = kategoriKekuatan[cluster.findCluster(d[1], clusterKekuatan.centroids)]
      d[2] = kategoriKedalaman[cluster.findCluster(d[2], clusterKedalaman.centroids)]
      d[3] = kategoriJarakGempa[cluster.findCluster(d[3], clusterJarakGempa.centroids)]
    }

    //Algoritma Decision Tree
    let atribut = ["kekuatanGempa", "kedalamanGempa", 'jarakGempa'] //Atribut
    let faktor = [1, 2, 3]
    const Decision = new DTC45(atribut, data)
    const tree = Decision.BuildTree(data, faktor, algo)
    // return res.send(tree)

    for (let i = 0; i < Earthquakes.length; i++) {
      let kasus = [kategoriKekuatan[cluster.findCluster(Earthquakes[i]['kekuatanGempa'], clusterKekuatan.centroids)], kategoriKedalaman[cluster.findCluster(Earthquakes[i]['kedalamanGempa'], clusterKedalaman.centroids)], kategoriJarakGempa[cluster.findCluster(Earthquakes[i]['jarakGempa'], clusterJarakGempa.centroids)]]
      let prediksi = Decision.predict(tree, kasus)

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

    res.render("Earthquake/tableDT", { title: "TableDecisionTree", css: "index.css", js: "tableKnn.js", data: Earthquakes, benar, salah, prediksi: ((benar / (benar + salah)) * 100).toFixed(2) })

  }


  static async tableKnn(req, res) {
    let limit = !req.query.limit ? 7 : req.query.limit
    let k = !req.query.k ? 3 : req.query.k

    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], limit, order: [['id', 'ASC']] })

    let data = []
    for (let gempa of Earthquakes) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }


    let atribut = ["kekuatanGempa", "kedalamanGempa", 'jarakGempa']
    let knn = new KNN(atribut, data)

    let prediksi = (knn.accuracy(data, k)).toFixed(2)

    for (let i = 0; i < data.length; i++) {
      let prediksi = knn.Train(data[i].slice(1, data[i].length - 1), k)
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
    res.render("Earthquake/decisiontree", { title: "DecisionTree", css: "decisiontree.css", js: "decisionTree.js", result: null, data: null })
  }


  static async postDecisionTree(req, res) {

    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], order: [['id', 'ASC']] })
    let data = []
    for (let gempa of Earthquakes) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }

    let kekuatanGempa = []
    let kedalamanGempa = []
    let jarakGempa = []
    for (let d of data) {
      kekuatanGempa.push(+d[1])
      kedalamanGempa.push(+d[2])
      jarakGempa.push(+d[3])
      d[1] = +d[1]
      d[2] = +d[2]
      d[3] = +d[3]
    }
    //Kategori
    let kategoriKekuatan = ["lemah", 'sedangK', 'kuat']
    let kategoriKedalaman = ['dangkal', 'sedangD', 'dalam']
    let kategoriJarakGempa = ['dekat', 'sedangJ', 'jauh']

    let cluster = new Clustering()
    //Cluster
    let clusterKekuatan = cluster.kMeans(kekuatanGempa, kategoriKekuatan.length)
    let clusterKedalaman = cluster.kMeans(kedalamanGempa, kategoriKedalaman.length)
    let clusterJarakGempa = cluster.kMeans(jarakGempa, kategoriJarakGempa.length)

    for (let d of data) {
      d[1] = kategoriKekuatan[cluster.findCluster(d[1], clusterKekuatan.centroids)]
      d[2] = kategoriKedalaman[cluster.findCluster(d[2], clusterKedalaman.centroids)]
      d[3] = kategoriJarakGempa[cluster.findCluster(d[3], clusterJarakGempa.centroids)]
    }
    //Algoritma Decision Tree
    let atribut = ["kekuatanGempa", "kedalamanGempa", 'jarakGempa'] //Atribut
    let faktor = [1, 2, 3]
    const Decision = new DTC45(atribut, data)
    const tree = Decision.BuildTree(data, faktor, true)
    //Predict
    let kasus = [kategoriKekuatan[cluster.findCluster(req.body.kekuatanGempa, clusterKekuatan.centroids)], kategoriKedalaman[cluster.findCluster(req.body.kedalamanGempa, clusterKedalaman.centroids)], kategoriJarakGempa[cluster.findCluster(req.body.jarakGempa, clusterJarakGempa.centroids)]]
    let result = Decision.predict(tree, kasus) ?? "Tidak dapat diklasifikasikan"

    setTimeout(() => {
      res.render("Earthquake/decisiontree", { title: "DecisionTree", css: "decisiontree.css", js: "decisionTree.js", data: req.body, result })
    }, 1500)

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
    let { type = "NotCategory" } = req.query
    let Earthquakes = await Earthquake.findAll({ attributes: ["id", "lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], order: [['id', 'ASC']] })
    let data = []
    for (let gempa of Earthquakes) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }

    let kekuatanGempa = []
    let kedalamanGempa = []
    let jarakGempa = []

    for (let d of data) {
      kekuatanGempa.push(+d[1])
      kedalamanGempa.push(+d[2])
      jarakGempa.push(+d[3])
      d[1] = +d[1]
      d[2] = +d[2]
      d[3] = +d[3]
    }
    //Kategori
    let kategoriKekuatan = ["lemah", 'sedangK', 'kuat']
    let kategoriKedalaman = ['dangkal', 'sedangD', 'dalam']
    let kategoriJarakGempa = ['dekat', 'sedangJ', 'jauh']

    let cluster = new Clustering()
    //Cluster
    let clusterKekuatan = cluster.kMeans(kekuatanGempa, kategoriKekuatan.length)
    let clusterKedalaman = cluster.kMeans(kedalamanGempa, kategoriKedalaman.length)
    let clusterJarakGempa = cluster.kMeans(jarakGempa, kategoriJarakGempa.length)

    if (type === 'Category') {
      for (let gempa of Earthquakes) {
        gempa['kekuatanGempa'] = kategoriKekuatan[cluster.findCluster(gempa['kekuatanGempa'], clusterKekuatan.centroids)]
        gempa['kedalamanGempa'] = kategoriKedalaman[cluster.findCluster(gempa['kedalamanGempa'], clusterKedalaman.centroids)]
        gempa['jarakGempa'] = kategoriJarakGempa[cluster.findCluster(gempa['jarakGempa'], clusterJarakGempa.centroids)]
      }
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
      }
    ]
    return download(res, 'dataGempaIndonesia.csv', fields, Earthquakes);
  }

}

module.exports = earthquekeController