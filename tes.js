"use strict"
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
let data = [
  [1, "sunny", "false", "high", "no"],
  [2, "sunny", "true", "high", "no"],
  [3, "sunny", "false", "high", "no"],
  [4, "sunny", "false", "medium", "yes"],
  [5, "sunny", "true", "medium", "yes"],
  [6, "overcast", "false", "medium", "yes"],
  [7, "overcast", "true", "medium", "yes"],
  [8, "overcast", "true", "high", "yes"],
  [9, "overcast", "false", "medium", "yes"],
  [10, "rain", "false", "high", "yes"],
  [11, "rain", "false", "medium", "yes"],
  [12, "rain", "true", "medium", "no"],
  [13, "rain", "false", "medium", "yes"],
  [14, "rain", "true", "medium", "no"]
]

class DTC45 {

  constructor(kelas, atribut, dataTraning) {
    this.kelas = kelas
    this.atribut = atribut
    this.dataTraning = dataTraning
    this.tree = {}
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
      result.push(d[index].trim())
    })

    let partisi = {}
    result.map((r) => {
      partisi[r] = []
    })
    data.map((d) => {
      for (let item in partisi) {
        if (item == d[index]) {
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
    let kelas = data[1][data[1].length - 1]
    let result = data.every((d) => (d[d.length - 1]) === kelas);
    return result ? kelas : result
  }

  train(algoC45 = true) {
    let atribut = {}
    for (let item in this.atribut) {
      atribut[this.atribut[item]] = +item + 1
    }
    let findRoot = this.findBestAtribut(this.dataTraning, atribut, false)
    console.log(findRoot);
    let partisi = this.SplitPartisi(data, findRoot['index'])
    console.log("tree", this.tree);
    for (let item in partisi) {
      console.log(item);
    }
  }

  test(data) {

  }
}

//Train
let kelas = ["no", 'yes']
let faktor = ["outlook", "windy", 'humadity']
let atribut = {}

let Algoritma = new DTC45(kelas, faktor, data)

Algoritma.train()

// console.log(Algoritma.SplitPartisi(data, 1));

console.log({
  Outlook: {
    Sunny: {
      Humadity: { High: "no", Medium: "yes" }
    },
    Overcast: "yes",
    Windy: { false: "yes", true: "no" }
  }
});

let Faktor = { Outlook: ['sunny', 'overcast', 'rain'], Windy: ["false", "true"], Humadity: ["high", 'medium'] }
console.log("----------------Faktor----------------");
console.log(Faktor);
for (let value of Faktor['Outlook']) {
  console.log(value);
}











// for (let item in faktor) {
//   atribut[faktor[item]] = +item + 1
// }
// let result = Algoritma.findBestAtribut(data, atribut, false)
// console.log(result);
// console.log(atribut);
// let tree = Algoritma.SplitPartisi(data, result['index'])

// console.log(tree);

// // console.log(Algoritma.endClass(tree['overcast']));
// delete atribut[faktor[result['index'] - 1]]
// console.log(atribut);
// //sunny
// console.log("------------Sunny(Outlook)------------");
// console.log(tree['sunny']);
// console.log(Algoritma.endClass(tree['sunny']));

// result = Algoritma.findBestAtribut(tree['sunny'], atribut, false)
// console.log(result);
// console.log(Algoritma.SplitPartisi(tree['sunny'], result['index']));


// //overcast
// console.log("--------------Overcast(Outlook)-------------");
// console.log(Algoritma.endClass(tree['overcast']));


// //rain
// console.log("---------------rain(outlook)-------");
// result = Algoritma.findBestAtribut(tree['rain'], atribut, false)
// console.log(result);
// console.log(Algoritma.SplitPartisi(tree['rain'], result['index']));

// let tre = {
//   Cuaca: {
//     Cerah: [], Berawan: [], Hujan: []
//   },
//   Suhu: {
//     Panas: [], Sejuk: [], Dingin: []
//   }
// }

// console.log({
//   Outlook: ['sunny', 'rain', 'overcast'],
//   Humadity: ["high", "medium"],
//   Windy: ['yes', 'no']
// });

