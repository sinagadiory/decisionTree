
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
        // console.log(i);
      }
    }
    // console.log(dataTraning);
    let clusteringApp = new Clustering()
    console.log(clusteringApp.kMeans(kekuatanGempa, 3));
    console.log("-------Kedalaman Gempa-------");
    console.log(clusteringApp.kMeans(kedalamanGempa, 3));
    console.log("----------JarakPusatGempa-------");
    console.log(clusteringApp.kMeans(jarakPusatGempa, 3));
    // console.log(kekuatanGempa);
  });
});