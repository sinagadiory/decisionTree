const { Earthquake } = require("../../models")
let { KNN, splitValidation, crossValidation, DTC45, Clustering, Matrix } = require("../../Logic/index")
const axios = require("axios")
const ss = require("simple-statistics")

class Api {

  static async postDecisionTree(req, res) {
    let Earthquakes = await Earthquake.findAll({ attributes: ["lokasi", 'kekuatanGempa', 'kedalamanGempa', 'jarakGempa', 'dampakGempa'], order: [['id', 'ASC']] })
    let CV = new crossValidation()
    let data = CV.runCrossValidation(Earthquakes, 10)
    let { dataTraning, dataTesting } = CV.splitCrossValidation(data, 0)
    let dataTrain = []
    for (let gempa of dataTraning) {
      dataTrain.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
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
    const tree = Decision.BuildTree(dataTrain, faktor, true)

    let dataGempaNew = await axios.get("https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json")
    dataGempaNew = dataGempaNew.data.Infogempa.gempa
    let jumlahKekuatanGempa = []
    let jumlahkedalamanGempa = []
    let jumlahJarakGempa = []
    dataGempaNew.map((d) => {
      jumlahKekuatanGempa.push(+d.Magnitude)
      jumlahkedalamanGempa.push(+d.Kedalaman.split(" ")[0])
      jumlahJarakGempa.push(+d.Wilayah.split(" ")[5])
    })

    let kasus = [kategoriKekuatan[cluster.findCluster(ss.mean(jumlahKekuatanGempa), clusterKekuatan.centroids)], kategoriKedalaman[cluster.findCluster(ss.mean(jumlahkedalamanGempa), clusterKedalaman.centroids)], kategoriJarakGempa[cluster.findCluster(ss.mean(jumlahJarakGempa), clusterJarakGempa.centroids)]]
    let result = Decision.predict(tree, kasus) ?? "Tidak dapat diklasifikasikan"

    res.send({ result, kekuatanGempa: ss.mean(jumlahKekuatanGempa), kedalamanGempa: ss.mean(jumlahkedalamanGempa), jarakGempa: ss.mean(jumlahJarakGempa) })
  }
}

module.exports = Api