const splitValidation = require("./splitValidation")
const crossValidation = require("./crossValidation")

let data = [
  ['Barat Laut Kab Cianjur', 2.1, 10, 5, 'Not Fealt'],
  ['Tenggara Pesisir Barat', 4.7, 46, 55, 'Not Fealt'],
  ['Barat Laut Kab Cianjur', 4.3, 10, 7, 'Fealt'],
  ['Timur Laut Alor', 4, 10, 45, 'Fealt'],
  ['Timur Laut Jayapura', 4.9, 10, 13, 'Fealt'],
  ['Barat Daya Kab Purwakarta', 3.6, 7, 22, 'Fealt'],
  ['Tenggara Meulaboh', 4.8, 1, 91, 'Not Fealt'],
  ['Barat Laut Kab Cianjur', 3.4, 4, 8, 'Fealt'],
  ['Timur Laut Kota Jayapura', 4, 10, 36, 'Not Fealt'],
  ['Timur Laut Kota Jayapura', 3.4, 10, 18, 'Not Fealt'],
]

// let data = [
//   ["A", 11, 26, "Kota"],
//   ["B", 15, 29, "Kota"],
//   ["C", 19, 28, "Kota"],
//   ["D", 18, 30, "Kota"],
//   ["E", 16, 26, "Kota"],
//   ["F", 23, 25, "Kabupaten"],
//   ["G", 25, 22, "Kabupaten"],
//   ["H", 21, 24, "Kabupaten"],
//   ["I", 23, 29, "Kabupaten"],
//   ["J", 29, 24, "Kabupaten"]
// ]
let test = [
  ["E", 16, 26, "Kota"], ["G", 25, 22, "Kabupaten"], ["R", 30, 11, "Kota"]
]

class Knn {
  constructor(atribut, dataTraning) {
    this.kelas = this.FindClass(dataTraning)
    this.atribut = atribut
    this.dataTraning = dataTraning
  }

  FindClass(data) {
    let result = []
    data.map((d) => {
      if (!result.find((r) => (r == d[d.length - 1]))) {
        result.push(d[d.length - 1])
      }
    })
    return result
  }

  EuclideanDistance(x, y) {
    let result = 0
    for (let i = 0; i < x.length; i++) {
      result += (x[i] - y[i]) ** 2
    }

    return Math.sqrt(result)
  }

  MinimumData(data) {
    let min = Infinity
    for (let item of data) {
      if (item < min) {
        min = item
      }
    }
    return min
  }

  WeightVoting(data) {
    let result = null
    let kelas = {}
    for (let item of this.kelas) {
      kelas[item] = 0
    }
    for (let d of data) {
      for (let item in kelas) {
        if (item === d[d.length - 1]) {
          kelas[item] += 1
        }
      }
    }
    let max = -Infinity
    for (let item in kelas) {
      if (max < kelas[item]) {
        max = kelas[item]
        result = item
      }
    }
    return result
  }

  Train(datum, k = 3) {
    let atribut = {}
    for (let i = 0; i < this.atribut.length; i++) {
      atribut[this.atribut[i]] = i + 1
    }
    let dataEuclidDistance = []
    for (let item of this.dataTraning) {
      let x = []
      for (let fak in atribut) {
        x.push(item[atribut[fak]]);
      }
      dataEuclidDistance.push([item[0], this.EuclideanDistance(x, datum), item[item.length - 1]])
    }


    dataEuclidDistance.sort(function (a, b) { return a[1] - b[1] })
    let kTitik = []
    for (let i = 0; i < k; i++) {
      kTitik.push(dataEuclidDistance[i])
    }

    return this.WeightVoting(kTitik)

  }

  accuracy(data, k = 3) {
    let result = 0
    let test = []
    for (let d of data) {
      test.push(d.slice(1, d.length - 1))
    }
    for (let i = 0; i < test.length; i++) {

      if (this.Train(test[i], k).trim() === data[i][data[i].length - 1].trim()) {
        result += 1
      }
    }
    return (result / data.length) * 100
  }

}


// let atribut = ["kekuatanGempa", "kedalamanGempa", 'jarakGempa']
// // let atribut = ["Latitude", "Longitude"]

// let knn = new Knn(atribut, data)
// console.log(knn.accuracy(data));
// let result = []
// data.map((d) => {
//   let prediksi = (knn.Train(d.slice(1, d.length - 1)));
//   result.push([...d, prediksi])
//   // d.push(prediksi)
// })
// console.log("----------------");
// console.log(knn.Train([4.8, 1, 91]));

// console.log("----------------------------");
// console.log(knn.accuracy(data));

// for (let i = 0; i < data.length; i++) {
//   let prediksi = knn.Train(data[i].slice(1, data[i].length - 1))
//   data[i].push(prediksi)
//   console.log(data[i].slice(1, data[i].length - 1));
//   console.log(prediksi);
// }

// console.log(data);
// console.log(knn.Train([4.8, 1, 91]));


let split = new splitValidation()
let cross = new crossValidation()

//Split Validation
// const { dataTraning, dataTesting } = split.runSplitValidation(data, 8)
// console.log(dataTraning);
// console.log("-----------------");
// console.log(dataTesting);
// let knn = new Knn(atribut, dataTraning)

// console.log(knn.accuracy(dataTesting));


//k-crossValidation
// const partisi = cross.runCrossValidation(data, 10)
// console.log(partisi);
// let jumlah = 0
// for (let i = 0; i < partisi.length; i++) {
//   let { dataTraning, dataTesting } = cross.splitCrossValidation(partisi, i)
//   let knn = new Knn(atribut, dataTraning)
//   jumlah += knn.accuracy(dataTesting)
// }
// console.log(jumlah / partisi.length);


// console.log(knn.Train([25, 22]));

// console.log(knn.test(test));


module.exports = Knn