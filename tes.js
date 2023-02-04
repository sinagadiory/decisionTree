
let data = [
  ['1', 'Cerah', 'Panas', 'Tidak'],
  ['2', 'Cerah', 'Panas', 'Tidak'],
  ['3', 'Berawan', 'Panas', 'Ya'],
  ['4', 'Hujan', 'Sejuk', 'Ya'],
  ['5', 'Hujan', 'Dingin', 'Ya'],
  ['6', 'Hujan', 'Dingin', 'Ya'],
  ['7', 'Berawan', 'Dingin', 'Tidak'],
  ['8', 'Cerah', 'Sejuk', 'Ya'],
  ['9', 'Cerah', 'Dingin', 'Ya'],
  ['10', 'Hujan', 'Sejuk', 'Ya']
]

'use strict';
const csv = require('async-csv');
const fs = require('fs').promises;

async function ReadData() {
  const csvString = await fs.readFile('./data/DataGempa.csv', 'utf-8');

  const rows = await csv.parse(csvString);
  const DataGempa = rows.slice(1)
  DataGempa.map((d) => {
    d[2] = +d[2]
    d[3] = +d[3]
    d[4] = +d[4]
  })
  return DataGempa
}

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
        result.push(d[d.length - 1])
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
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i][data[i].length - 1] === data[i + 1][data[i + 1].length - 1]) {
        result = true
        Class = data[i + 1][data[i].length - 1]
      }
      else result = false
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
      return result
    }

    let best = this.findBestAtribut(data, faktor, algoC45)
    let tree = {}
    tree.atribut = this.atribut[best.index]
    tree.child = {}
    let dataPartisi = this.SplitPartisi(data, best.index)
    for (let item in dataPartisi) {
      let nextFaktor = faktor.filter((f) => f !== best.index)
      tree.child[item] = this.BuildTree(dataPartisi[item], nextFaktor, algoC45)
    }
    return tree
  }

  // BuildTree(node = null, data = null, faktor = null) {
  //   if (!node) node = {}
  //   if (!data) data = this.dataTraning
  //   if (!faktor) faktor = []
  //   for (let i = 0; i < this.atribut.length - 1; i++) {
  //     faktor.push(i)
  //   }
  //   let classData = this.endClass(data)
  //   if (classData) {
  //     node.Class = classData
  //     return node
  //   }
  //   let { max, index } = this.findBestAtribut(data, faktor)
  //   node.Atribut = this.atribut[index]
  //   node.Partisi = this.SplitPartisi(data, index)
  //   for (let item in node.Partisi) {
  //     node[item] = {}
  //     node[item] = this.BuildTree(node[item], node.Partisi[item], faktor.filter((f) => (f !== index)))
  //   }
  //   return node
  // }

  // buildTree(data, faktor, algoC45 = true) {
  //   // Jika tidak ada data atau tidak ada faktor, kembalikan null
  //   if (!data || !faktor || !faktor.length) return null

  //   // Jika semua data memiliki kelas yang sama, kembalikan kelas tersebut
  //   let classList = [...new Set(data.map(d => d.kelas))]
  //   if (classList.length === 1) return classList[0]

  //   // Mencari atribut terbaik dengan InformationGain atau GainRatio
  //   let { max, index } = this.findBestAttribute(data, faktor, algoC45)

  //   // Jika tidak ada atribut terbaik, kembalikan kelas paling sering muncul
  //   if (index === null) {
  //     let kelasCount = {}
  //     for (let d of data) {
  //       if (!kelasCount[d.kelas]) kelasCount[d.kelas] = 0
  //       kelasCount[d.kelas]++
  //     }
  //     return Object.keys(kelasCount).sort((a, b) => kelasCount[b] - kelasCount[a])[0]
  //   }

  //   // Membuat root dari pohon keputusan
  //   let root = { attribute: index }
  //   root.children = {}

  //   // Membagi data berdasarkan atribut terbaik
  //   let subData = {}
  //   for (let value of [...new Set(data.map(d => d[index]))]) {
  //     subData[value] = data.filter(d => d[index] === value)
  //   }

  //   // Membuat child untuk setiap nilai atribut terbaik
  //   for (let value in subData) {
  //     root.children[value] = this.buildTree(subData[value], faktor.filter(f => f !== index), algoC45)
  //   }

  //   return root
  // }

  train(datum, algoC45 = true) {
    let atribut = {}
    let dataTraning = this.dataTraning
    let tree = {}
    for (let item in this.atribut) {
      atribut[this.atribut[item]] = +item + 1
    }
    // tree[atribut]
    let result = this.findBestAtribut(dataTraning, atribut, false)
    tree[this.atribut[result['index'] - 1]] = this.SplitPartisi(data, result['index'])
    for (let item in tree) {
      console.log(tree[item]);
    }
  }

  test(data) {

  }
}




let dataLatih = [
  [1, 'Sangat Baik', 'Tinggi', 'Ya', 'Mahal', 'Tidak'],
  [2, 'Baik', 'Tinggi', 'Ya', 'Mahal', 'Tidak'],
  [3, 'Rendah', 'Tinggi', 'Tidak', 'Murah', 'Ya'],
  [4, 'Sangat Baik', 'Sangat Tinggi', 'Tidak', 'Mahal', 'Tidak'],
  [5, 'Baik', 'Rendah', 'Ya', 'Murah', 'Ya'],
  [6, 'Sangat Baik', 'Rendah', 'Tidak', 'Murah', 'Ya'],
  [7, 'Baik', 'Tinggi', 'Tidak', 'Mahal', 'Tidak'],
  [8, 'Sangat Baik', 'Sangat Tinggi', 'Ya', 'Mahal', 'Tidak'],
  [9, 'Rendah', 'Rendah', 'Ya', 'Murah', 'Ya'],
  [10, 'Rendah', 'Tinggi', 'Ya', 'Murah', 'Tidak'],
];

let faktor = [0, 1, 2, 3];

let dtc = new DTC45(faktor, dataLatih);
let pohon = dtc.BuildTree(dataLatih, faktor, true);
console.log(JSON.stringify(pohon));

// let atribut = {}
// for (let item in faktor) {
//   atribut[faktor[item]] = +item + 1
// }

// let indexAtributEnd = []

// let indexRoot = DecisionTree.findBestAtribut(data, atribut, false).index

// indexAtributEnd.push(indexRoot)

// let splitAtributRoot = DecisionTree.SplitPartisi(data, indexRoot)

// for (let partisi in splitAtributRoot) {
//   console.log(splitAtributRoot[partisi]);
//   console.log("-------------------------------------");
//   console.log(DecisionTree.endClass(splitAtributRoot[partisi]));
// }


module.exports = DTC45