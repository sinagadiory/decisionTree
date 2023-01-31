const splitValidation = require("./splitValidation")
const crossValidation = require("./crossValidation")

let data = [
  ["A", 11, 26, "Kota"],
  ["B", 15, 29, "Kota"],
  ["C", 19, 28, "Kota"],
  ["D", 18, 30, "Kota"],
  ["E", 16, 26, "Kota"],
  ["F", 23, 25, "Kabupaten"],
  ["G", 25, 22, "Kabupaten"],
  ["H", 21, 24, "Kabupaten"],
  ["I", 23, 29, "Kabupaten"],
  ["J", 29, 24, "Kabupaten"]
]

let test = [
  ["E", 16, 26, "Kota"], ["G", 25, 22, "Kabupaten"],
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

  accuracy(data) {
    let result = 0
    let test = []
    for (let d of data) {
      test.push(d.slice(1, d.length - 1))
    }
    for (let i = 0; i < test.length; i++) {

      if (this.Train(test[i]) === data[i][data[i].length - 1]) {
        result += 1
      }
    }
    return (result / data.length) * 100
  }

}


let atribut = ["Latitude", "Longitude"]


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
const partisi = cross.runCrossValidation(data, 10)
console.log(partisi);
let jumlah = 0
for (let i = 0; i < partisi.length; i++) {
  let { dataTraning, dataTesting } = cross.splitCrossValidation(partisi, i)
  let knn = new Knn(atribut, dataTraning)
  jumlah += knn.accuracy(dataTesting)
}
console.log(jumlah / partisi.length);


// console.log(knn.Train([25, 22]));

// console.log(knn.test(test));


module.exports = Knn