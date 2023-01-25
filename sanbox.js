
let fs = require('fs');
let csv = require('csv');
let Knn = require("./Logic/KNN")
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
    let dataTraning = data.slice(1, data.length - 1)
    let kekuatanGempa = []
    for (let d of dataTraning) {
      d.splice(1, 1)
      for (let i = 1; i < d.length - 1; i++) {
        if (i === 1) {
          kekuatanGempa.push(+d[i])
        }
        d[i] = +d[i]
        // console.log(i);
      }
    }
    // console.log(dataTraning);
    let clusteringApp = new Clustering()
    console.log(clusteringApp.kMeans(kekuatanGempa, 3));
    // console.log(kekuatanGempa);
  });
});