
// let data = [
//   ['1', 'Cerah', 'Panas', 'Tidak'],
//   ['2', 'Cerah', 'Panas', 'Tidak'],
//   ['3', 'Berawan', 'Panas', 'Ya'],
//   ['4', 'Hujan', 'Sejuk', 'Ya'],
//   ['5', 'Hujan', 'Dingin', 'Ya'],
//   ['6', 'Hujan', 'Dingin', 'Ya'],
//   ['7', 'Berawan', 'Dingin', 'Tidak'],
//   ['8', 'Cerah', 'Sejuk', 'Ya'],
//   ['9', 'Cerah', 'Dingin', 'Ya'],
//   ['10', 'Hujan', 'Sejuk', 'Ya']
// ]
// let data1 = [
//   ['Cerah', 'Panas', 'Tidak'],
//   ['Cerah', 'Panas', 'Tidak'],
//   ['Berawan', 'Panas', 'Ya'],
//   ['Hujan', 'Sejuk', 'Ya'],
//   ['Hujan', 'Dingin', 'Ya'],
//   ['Hujan', 'Dingin', 'Ya'],
//   ['Berawan', 'Dingin', 'Tidak'],
//   ['Cerah', 'Sejuk', 'Ya'],
//   ['Cerah', 'Dingin', 'Ya'],
//   ['Hujan', 'Sejuk', 'Ya']
// ]

// 'use strict';
// const csv = require('async-csv');
// const fs = require('fs').promises;

// async function ReadData() {
//   const csvString = await fs.readFile('./data/DataGempa.csv', 'utf-8');

//   const rows = await csv.parse(csvString);
//   const DataGempa = rows.slice(1)
//   DataGempa.map((d) => {
//     d[2] = +d[2]
//     d[3] = +d[3]
//     d[4] = +d[4]
//   })
//   return DataGempa
// }

class DTC45 {

  constructor(atribut, dataTraning) {
    this.kelas = this.FindClass(dataTraning)
    this.atribut = atribut
    this.dataTraning = dataTraning
  }

  FindClass(data) {
    let result = []
    data.map((d) => {
      if (!result.find((r) => (r == d[d.length - 1]))) {
        result.push(d[d.length - 1].trim())
      }
    })
    return result
  }

  Entropy(data) {
    let Besaran = {
      SumD() {
        let sum = 0
        for (let item in Besaran) {
          if (typeof Besaran[item] !== 'function') {
            sum += Besaran[item]
          }
        }
        return sum
      }, EntropyD() {
        let sum = 0;
        for (let item in Besaran) {
          if (typeof Besaran[item] !== 'function') {
            if (Besaran[item] === 0) {
              sum = 0
              break
            }
            sum += -1 * (Besaran[item] / Besaran.SumD()) * Math.log2((Besaran[item]) / Besaran.SumD())
          }
        }

        return sum
      }
    }

    this.kelas.map((k) => {
      Besaran[k] = 0
      data.map((d) => {
        if (k === d[d.length - 1]) Besaran[k] += 1
      })
    })

    return Besaran.EntropyD()
  }

  EntropyAtribut(data, index) {
    let dataPartisi = this.SplitPartisi(data, index)
    let result = 0
    for (let item in dataPartisi) {
      result += (dataPartisi[item].length / data.length) * this.Entropy(dataPartisi[item])
    }
    return result
  }

  InformationGain(data, index) {
    return this.Entropy(data) - this.EntropyAtribut(data, index)
  }

  GainRatio(data, index) {
    if (this.InformationGain(data, index) / this.SplitInfo(data, index) != "number") {
      return 0
    }
    return this.InformationGain(data, index) / this.SplitInfo(data, index)
  }

  SplitInfo(data, index) {
    let dataPartisi = this.SplitPartisi(data, index)
    let result = 0
    for (let item in dataPartisi) {
      result += -1 * (dataPartisi[item].length / data.length) * (Math.log2(dataPartisi[item].length / data.length))
    }
    return result
  }

  SplitPartisi(data, index) {
    let result = []
    data.map((d) => {
      result.push(d[index])
    })
    let partisi = {}
    result.map((r) => {
      partisi[r] = []
    })
    data.map((d) => {
      for (let item in partisi) {
        if (item === d[index]) {
          partisi[item].push(d)
        }
      }
    })
    return partisi
  }

  findBestAtribut(data, faktor, algoC45 = true) {
    let max = -Infinity
    let index = null
    for (let item in faktor) {
      if (!algoC45) {
        if (this.InformationGain(data, faktor[item]) > max) {
          max = this.InformationGain(data, faktor[item])
          index = faktor[item]
        }
      } else {
        if (this.GainRatio(data, faktor[item]) > max) {
          max = this.GainRatio(data, faktor[item])
          index = faktor[item]
        }
      }
    }
    return { max, index }
  }

  endClass(data) {
    let result = false
    let Class = null
    if (data.length === 1) return data[0][data[0].length - 1]
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i][data[i].length - 1] === data[i + 1][data[i + 1].length - 1]) {
        result = true
        Class = data[i + 1][data[i].length - 1]
      }
      else {
        result = false
        break
      }
    }
    return result ? Class : result
  }

  BuildTree(data, faktor, algoC45 = true) {
    let end = this.endClass(data)
    if (end) return end
    if (faktor.length === 0) {
      let result = {}
      this.kelas.map((k) => {
        result[k] = 0
      })
      data.map((d) => {
        result[d[d.length - 1]] += 1
      })
      let max = -Infinity
      let hasil = null

      for (let item in result) {
        if (result[item] > max) {
          max = result[item]
          hasil = item;
        }
      }
      return hasil
    }

    let best = this.findBestAtribut(data, faktor, algoC45)
    let tree = {}
    tree.atribut = this.atribut[best.index - 1]
    // console.log(this.atribut[best.index - 1]);
    tree.child = {}
    let dataPartisi = this.SplitPartisi(data, best.index)
    for (let item in dataPartisi) {
      let nextFaktor = faktor.filter((f) => f !== best.index)
      tree.child[item] = this.BuildTree(dataPartisi[item], nextFaktor, algoC45)
    }
    return tree
  }

  predict(tree, kasus) {
    if (typeof tree === 'object') {
      let atribut = tree.atribut
      let child = tree.child
      let idx = this.atribut.indexOf(atribut)
      let value = kasus[idx]
      return this.predict(child[value], kasus)
    }
    else {
      return tree
    }
  }

}

// let atribut = ["Cuaca", "Suhu"]
// let Decision = new DTC45(atribut, data)
// let faktor1 = [1, 2]
// let tree = Decision.BuildTree(data, faktor1, false)
// console.log(JSON.stringify(tree));
// console.log(Decision.predict(tree, ["Cerah", "Panas"]));

// let dataSuny = [
//   [1, "sunny", "false", "high", "no"],
//   [2, "sunny", "true", "high", "no"],
//   [3, "sunny", "false", "high", "no"],
//   [4, "sunny", "false", "medium", "yes"],
//   [5, "sunny", "true", "medium", "yes"],
//   [6, "overcast", "false", "medium", "yes"],
//   [7, "overcast", "true", "medium", "yes"],
//   [8, "overcast", "true", "high", "yes"],
//   [9, "overcast", "false", "medium", "yes"],
//   [10, "rain", "false", "high", "yes"],
//   [11, "rain", "false", "medium", "yes"],
//   [12, "rain", "true", "medium", "no"],
//   [13, "rain", "false", "medium", "yes"],
//   [14, "rain", "true", "medium", "no"],
//   [15, "rain", "false", "medium", "yes"],
//   [16, "sunny", "true", "medium", "yes"],
//   [17, "rain", "false", "medium", "yes"],
//   [18, "rain", "true", "high", "yes"]
// ]
// let atribut1 = ['outlook', 'windy', 'humadity']
// let faktor = [1, 2, 3]

// let Decision = new DTC45(atribut1, dataSuny)

// let tree = Decision.BuildTree(dataSuny, faktor, true)
// console.log(JSON.stringify(tree));


// let dataGempa = [
//   [
//     "Barat Laut Kab Cianjur  ",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Tenggara Pesisir Barat",
//     "sedangK",
//     "sedangD",
//     "sedangJ",
//     "Not"
//   ],
//   [
//     "Barat Laut Kab Cianjur",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Alor",
//     "sedangK",
//     "dangkal",
//     "sedangJ",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Jayapura",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat Daya Kab Purwakarta",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Tenggara Meulaboh",
//     "sedangK",
//     "dangkal",
//     "sedangJ",
//     "Not"
//   ],
//   [
//     "Barat Laut Kab Cianjur",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Kota Jayapura",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Timur Laut Kota Jayapura",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Barat Daya Kota Jayapura",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Barat Laut Wonosobo",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Timur Laut Pamala",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Kota Jayapura",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Kota Jayapura",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Tenggara Pacitan",
//     "kuat",
//     "dangkal",
//     "jauh",
//     "Not"
//   ],
//   [
//     "Barat Laut Jayapura",
//     "sedangK",
//     "dangkal",
//     "sedangJ",
//     "Fealt"
//   ],
//   [
//     "Tenggara Melonguane",
//     "kuat",
//     "sedangD",
//     "jauh",
//     "Fealt"
//   ],
//   [
//     "Tenggara Bone Bolango",
//     "kuat",
//     "dalam",
//     "sedangJ",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Kota Jayapura",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Barat Daya Kab Cianjur",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat Laut Kab Cianjur",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Ruteng",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat Laut Kab Jayapura",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Tenggara Kab Pekalongan",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Tenggara Kab Pekalongan",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Tenggara Kab Pekalongan",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Pulau Sipora",
//     "sedangK",
//     "dangkal",
//     "sedangJ",
//     "Not"
//   ],
//   [
//     "Barat Daya Kab Malang",
//     "sedangK",
//     "dangkal",
//     "jauh",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Jayapura",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Barat Laut Kab Cianjur",
//     "kuat",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Barat Laut Maluku",
//     "kuat",
//     "dalam",
//     "jauh",
//     "Fealt"
//   ],
//   [
//     "Tenggara Pacitan",
//     "kuat",
//     "sedangD",
//     "sedangJ",
//     "Fealt"
//   ],
//   [
//     "Kab Karangasem",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Kota Sukabumi",
//     "kuat",
//     "dalam",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat Laut Kab Garut",
//     "kuat",
//     "dalam",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Selatan Kota Garut",
//     "sedangK",
//     "sedangD",
//     "sedangJ",
//     "Fealt"
//   ],
//   [
//     "Barat Daya Kota Bengkulu",
//     "kuat",
//     "dangkal",
//     "jauh",
//     "Fealt"
//   ],
//   [
//     "Barat Daya Kab Garut",
//     "kuat",
//     "dangkal",
//     "jauh",
//     "Fealt"
//   ],
//   [
//     "Barat Laut Kab Tojo Una-una",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Tenggara Kota Lahat",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat Daya Kota Muara Enim",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Selatan Kab Lebak",
//     "kuat",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Kab Sumedang",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat Laut Kab Tapanuli Utara",
//     "kuat",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat Daya Kab Aceh Barat",
//     "kuat",
//     "dangkal",
//     "sedangJ",
//     "Fealt"
//   ],
//   [
//     "Barat Laut Kepulauan Mentawai",
//     "kuat",
//     "dangkal",
//     "jauh",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Membaromo Raya",
//     "kuat",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Kab Kepulauan Mentawai",
//     "kuat",
//     "dangkal",
//     "jauh",
//     "Fealt"
//   ],
//   [
//     "Kab Kaur, Prov Bengkulu",
//     "kuat",
//     "dangkal",
//     "sedangJ",
//     "Fealt"
//   ],
//   [
//     "Tenggara Kab Aceh ",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Barat daya gunung Kidul",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Kab Bandung",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Kab Cianjur",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat daya Daruba",
//     "kuat",
//     "dalam",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Timur laut Tabelo",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat Laut Wonosobo",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Timur Laut Wonosobo",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat Daya Luwu Timur",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Kota Jayapura",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Tembrauw",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat Daya Kaimana",
//     "sedangK",
//     "dangkal",
//     "sedangJ",
//     "Fealt"
//   ],
//   [
//     "Kairatu",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Ruteng",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Timur Laut Jayapura",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Barat Daya Pinrang",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat Laut Wonosobo",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Barat Laut Cianjur",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Not"
//   ],
//   [
//     "Barat Laut Pulau Numfor",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Tenggara Kaur",
//     "sedangK",
//     "sedangD",
//     "sedangJ",
//     "Not"
//   ],
//   [
//     "Barat Daya Lombok Barat",
//     "lemah",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ],
//   [
//     "Barat Daya Kab Garut",
//     "sedangK",
//     "dangkal",
//     "dekat",
//     "Fealt"
//   ]
// ]
// let atribut1 = ['kekuatanGempa', 'kedalamanGempa', 'jarakGempa']
// let faktor = [1, 2, 3]

// let Decision = new DTC45(atribut1, dataGempa)

// let tree = Decision.BuildTree(dataGempa, faktor, true)
// console.log(JSON.stringify(tree));



// let kasus = ["sunny", 'false', 'high']

// let result = Decision.predict(tree, kasus)

// console.log(JSON.stringify(result));


module.exports = DTC45