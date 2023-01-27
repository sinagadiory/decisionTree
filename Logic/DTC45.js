
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
class DTC45 {

  constructor(kelas, atribut, dataTraning) {
    this.kelas = kelas
    this.atribut = atribut
    this.dataTraning = dataTraning
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
          // console.log(max);
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

  train(algoC45 = true) {
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

module.exports = DTC45

//Train
// let kelas = ["Ya", "Tidak"]
// let faktor = ["Cuaca", "Suhu"]


// let Algoritma = new DTC45(kelas, faktor, data)

// let atribut = {}
// let tree = {}
// for (let item in faktor) {
//   atribut[faktor[item]] = +item + 1
// }

// //Find Beast Feature from faktor(atribut)
// let result = Algoritma.findBestAtribut(data, atribut, false)

// //Contruct tree
// tree[faktor[result['index'] - 1]] = Algoritma.SplitPartisi(data, result['index'])

// // console.log("Result", result);
// // console.log("Atribut", atribut);
// // console.log("----------------Tree DTC45----------------");
// // console.log(tree);


// function endClass(data) {
//   let result = false
//   let Class = null
//   for (let i = 0; i < data.length - 1; i++) {
//     if (data[i][data[i].length - 1] === data[i + 1][data[i + 1].length - 1]) {
//       result = true
//       Class = data[i + 1][data[i].length - 1]
//     }
//     else result = false
//   }
//   // console.log(result);
//   return result ? Class : result
// }

// //Lanjutan 
// for (let value in tree) {
//   // console.log(tree[value]);
//   for (let item in tree[value]) {
//     // console.log(tree[value][item]);
//     if (endClass(tree[value][item])) {
//       tree[value][item] = endClass(tree[value][item])
//     } else {
//       console.log(Algoritma.Entropy(tree[value][item]));
//     }
//   }
// }
// delete atribut['Suhu']
// console.log("Tree", tree);
// console.log("--------------------------");
// for (let value in tree) {
//   for (let item in tree[value]) {
//     console.log(tree[value][item]);
//     if (typeof tree[value][item] === "object") {
//       let result = Algoritma.findBestAtribut(tree[value][item], atribut, false)
//       console.log(result);
//       tree[value][item][faktor[result['index'] - 1]] = Algoritma.SplitPartisi(tree[value][item], result['index'])
//     }
//   }
// }
// console.log(atribut);
// console.log(tree);
// console.log(end(tree['Suhu']['Sejuk']));
// console.log(Algoritma.SplitPartisi(tree['Suhu']['Panas'], 1));

// let hasilKeputusan = {
//   Suhu:
//   {
//     Panas: {
//       Cuaca: {
//         Cerah: "Tidak", Berawan: "Ya"
//       }
//     }, Sejuk: "Ya", Dingin: {
//       Cuaca: {
//         Cerah: "Ya", Berawan: "Tidak", Hujan: "Ya"
//       }
//     }
//   }
// }



module.exports = DTC45