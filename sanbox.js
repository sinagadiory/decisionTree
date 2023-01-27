
let fs = require('fs');
let csv = require('csv');
let Knn = require("./Logic/KNN")
let DTC43 = require("./Logic/DTC45")
let Clustering = require("./Logic/Clustering")

fs.readFile('./data/DataGempa.csv', function (err, data) {
  if (err) {
    console.error(err);
    return false;
  }

  csv.parse(data, function (err, data) {
    if (err) {
      console.error(err);
      return false;
    }
    let headers = data[0]
    let kelas = ['Fealt', "Not Fealt", "Slight Demage"]
    let atribut = headers.slice(2, -1)
    let dataTraning = data.slice(1, data.length)
    let kekuatanGempa = []
    let kedalamanGempa = []
    let jarakPusatGempa = []
    for (let d of dataTraning) {
      d.splice(1, 1)
      for (let i = 1; i < d.length - 1; i++) {
        if (i === 1) {
          kekuatanGempa.push(+d[i])
        } else if (i === 2) {
          kedalamanGempa.push(+d[i])
        } else if (i === 3) {
          jarakPusatGempa.push(+d[i])
        }
        d[i] = +d[i]
      }
    }
    console.log(dataTraning);
    let clusteringApp = new Clustering()
    let clusterKekuatan = clusteringApp.kMeans(kekuatanGempa, 3, true)
    let clusterKedalaman = clusteringApp.kMeans(kedalamanGempa, 3, true)
    let clusterPusatGempa = clusteringApp.kMeans(jarakPusatGempa, 3, true)

    let kategoriKekuatan = ["lemah", 'sedang', 'kuat']
    let kategoriKedalaman = ['dangkal', 'sedang', 'dalam']
    let kategoriJarakPusatGempa = ['dekat', 'sedang', 'jauh']

    for (let d of dataTraning) {
      d[1] = kategoriKekuatan[clusteringApp.findCluster(d[1], clusterKekuatan.centroids)]
      d[2] = kategoriKedalaman[clusteringApp.findCluster(d[2], clusterKedalaman.centroids)]
      d[3] = kategoriJarakPusatGempa[clusteringApp.findCluster(d[3], clusterPusatGempa.centroids)]
    }

    // console.log(dataTraning);
    // console.log(atribut);
    //Decision Tree C45
    let DecisionTree = new DTC43(kelas, atribut, dataTraning)
    let faktor = {}
    for (let item in atribut) {
      faktor[atribut[item]] = +item + 1
    }
    console.log(faktor);
    let root = DecisionTree.findBestAtribut(dataTraning, faktor)
    // console.log(root);
    let SplitPartisiAtributRoot = DecisionTree.SplitPartisi(dataTraning, root.index)

    // console.log(SplitPartisiAtributRoot);
    console.log("lemah", DecisionTree.findBestAtribut(SplitPartisiAtributRoot.lemah, faktor));
    console.log("sedang", DecisionTree.findBestAtribut(SplitPartisiAtributRoot.sedang, faktor));
    console.log("kuat", DecisionTree.findBestAtribut(SplitPartisiAtributRoot.kuat, faktor));
  });
});