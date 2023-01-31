const splitValidation = require("./splitValidation")


const split = new splitValidation()
class crossValidation {

  runCrossValidation(data, k = 10, systematicSample = false) {
    const banyakData = Math.floor(data.length / k)
    let partisi = []
    let check = []
    for (let i = 0; i < k; i++) {
      partisi[i] = []
    }

    if (!systematicSample) {
      for (let j = 0; j < partisi.length; j++) {
        let z = 0
        while (z < banyakData) {
          let index = split.findCenterRandom(data)
          if (!check.some((c) => (c == index))) {
            partisi[j].push(index)
            check.push(index)
            z++
          }
        }
      }
    }

    //Sort Partisi
    for (let i = 0; i < k; i++) {
      partisi[i].sort((a, b) => (a - b))
    }

    for (let i = 0; i < k; i++) {
      for (let j = 0; j < partisi[i].length; j++) {
        partisi[i][j] = data[partisi[i][j]]
      }
    }

    return partisi
  }

  splitCrossValidation(partisi, i) {
    let dataTraning = []
    for (let j = 0; j < partisi.length; j++) {
      if (j !== i) {
        partisi[j].map((p) => {
          dataTraning.push(p)
        })
      }
    }
    return { dataTraning, dataTesting: partisi[i] }
  }
}

let data = [['1', 'Barat Laut Kab Cianjur', 2.1, 10, 5, 'Not Fealt'],
['2', 'Tenggara Pesisir Barat', 4.7, 46, 55, 'Not Fealt'],
['3', 'Barat Laut Kab Cianjur', 4.3, 10, 7, 'Fealt'],
['4', 'Timur Laut Alor', 4, 10, 45, 'Fealt'],
['5', 'Timur Laut Jayapura', 4.9, 10, 13, 'Fealt'],
['6', 'Barat Daya Kab Purwakarta', 3.6, 7, 22, 'Fealt'],
['7', 'Tenggara Meulaboh', 4.8, 1, 91, 'Not Fealt'],
['8', 'Barat Laut Kab Cianjur', 3.4, 4, 8, 'Fealt'],
['9', 'Timur Laut Kota Jayapura', 4, 10, 36, 'Not Fealt'],
['10', 'Timur Laut Kota Jayapura', 3.4, 10, 18, 'Not Fealt'],
['11', 'Barat Daya Kota Jayapura', 3.9, 21, 8, 'Not Fealt'],
['12', 'Barat Laut Wonosobo', 2.3, 8, 22, 'Not Fealt'],
['13', 'Timur Laut Pamala', 3.2, 7, 4, 'Fealt'],
['14', 'Timur Laut Kota Jayapura', 4, 6, 39, 'Fealt'],
['15', 'Timur Laut Kota Jayapura', 3.9, 10, 32, 'Fealt'],
['16', 'Tenggara Pacitan', 5.4, 10, 306, 'Not Fealt'],
['17', 'Barat Laut Jayapura', 4.4, 22, 78, 'Fealt'],
['18', 'Tenggara Melonguane', 7.1, 64, 141, 'Fealt'],
['19', 'Tenggara Bone Bolango', 6.3, 138, 69, 'Fealt'],
['20', 'Timur Laut Kota Jayapura', 3.4, 10, 18, 'Not Fealt']]

let CV = new crossValidation()

// let result = CV.runCrossValidation(data, 10)
// console.log(result);

// console.log(CV.splitCrossValidation(result, 1));
// console.log(result);

module.exports = crossValidation