let fs = require('fs');
let csv = require('csv');
let Knn = require("./Logic/KNN")
// let C45 = require("./logic")

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
    // console.log(data);
    let headers = data[0]
    let kelas = ['Fealt', "Not Fealt", "Slight Demage"]
    let atribut = headers.slice(2, -1)
    let dataTraning = data.slice(1, data.length - 1)
    // console.log(dataTraning);
    for (let d of dataTraning) {
      d.splice(1, 1)
    }
    // console.log(dataTraning);
    let KNN = new Knn(kelas, dataTraning)

    console.log(KNN.Train([6.5, 12, 66.3], 5));
    // console.log(dataTraning);
    // var headers = data[0];
    // var features = headers.slice(1, -1); // ["attr1", "attr2", "attr3"]
    // var trainingData = data.slice(1).map(function (d) {
    //   return d.slice(1);
    // });
    // var target = headers[headers.length - 1]; // "class"
    // var c45 = C45();
    // console.log(data);
    // console.log(features);
  });
});