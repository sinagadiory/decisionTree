
class splitValidation {

  findCenterRandom(data) {
    let index = Math.floor(Math.random() * (data.length)) + 0
    return index
  }

  systematicSample(data, n) {
    data.sort((a, b) => (a - b))

    let k = Math.floor(data.length / n)
    let result = []
    let i = Math.floor(Math.random() * (k)) + 0

    let j = 0
    while (j < n) {
      result.push(i)
      i += k
      j++
    }
    return result
  }

  runSplitValidation(data, train, systematicSample = false) {
    let banyakDataTraning = Math.ceil((train / 10) * data.length)
    let banyakDataTesting = data.length - banyakDataTraning

    let dataTraning = []
    let dataTesting = []

    let i = 0
    if (systematicSample) {
      while (i < banyakDataTesting) {
        let sample = this.systematicSample(data, banyakDataTesting)
        for (let s of sample) {
          dataTesting.push(s)
          i++
        }
      }
    } else {
      while (i < banyakDataTraning) {
        let index = this.findCenterRandom(data)
        if (!dataTraning.some((d) => (d == index))) {
          dataTraning.push(index)
          i++
        }
      }
    }

    if (!systematicSample) {
      for (let i = 0; i < data.length; i++) {
        if (!dataTraning.some((d) => (d == i))) {
          dataTesting.push(i)
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (!dataTesting.some((d) => (d == i))) {
          dataTraning.push(i)
        }
      }
    }

    //Sort Traning
    dataTraning.sort((a, b) => (a - b))

    //Sort Testing
    dataTesting.sort((a, b) => (a - b))

    //Traning
    for (let i = 0; i < banyakDataTraning; i++) {
      dataTraning[i] = data[dataTraning[i]]
    }

    //Testing
    for (let i = 0; i < banyakDataTesting; i++) {
      dataTesting[i] = data[dataTesting[i]]
    }

    return { dataTraning, dataTesting }
  }


}


let split = new splitValidation()

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

// console.log(split.runSplitValidation(data, 7, false));
// console.log("-------------------------------------------");
// console.log(split.runSplitValidation(data, 7, true));


module.exports = splitValidation