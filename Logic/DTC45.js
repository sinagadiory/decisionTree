
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
    // if (typeof (this.InformationGain(data, index) / this.SplitInfo(data, index)) !== "number") {
    //   return 0
    // }
    if (this.SplitInfo(data, index) === 0) {
      return 0
    }
    return this.InformationGain(data, index) / this.SplitInfo(data, index)
  }

  SplitInfo(data, index) {
    let dataPartisi = this.SplitPartisi(data, index)
    let result = 0
    for (let item in dataPartisi) {
      if (dataPartisi[item].length === 0) {
        result = 0
        break
      }
      result += -1 * (dataPartisi[item].length / data.length) * (Math.log2(dataPartisi[item].length / data.length))
    }
    // console.log(result);
    return result
  }

  SplitPartisi(data, index) {
    // let result = []
    let result = this.findValueAtribut(this.dataTraning, index)
    // data.map((d) => {
    //   result.push(d[index])
    // })
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

  MajorityClass(data) {
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

  findValueAtribut(data, index) {
    let result = []
    data.map((d) => {
      if (!result.find((r) => (r == d[index]))) {
        result.push(d[index].trim())
      }
    })
    return result
  }


  BuildTree(data, faktor, algoC45 = true) {
    let end = this.endClass(data)
    if (end) return end
    if (faktor.length === 0) {
      return this.MajorityClass(data)
    }

    let best = this.findBestAtribut(data, faktor, algoC45)
    let tree = {}
    tree.atribut = this.atribut[best.index - 1]
    // console.log(this.atribut[best.index - 1]);
    tree.child = {}
    let dataPartisi = this.SplitPartisi(data, best.index)
    for (let item in dataPartisi) {
      if (dataPartisi[item].length === 0) {
        tree.child[item] = this.MajorityClass(data)
        continue
      }
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

let data1 = [
  [1, 'rendah', 'ASN', 'buruk', 'kontrak', 'tidak layak'],
  [2, 'tinggi', 'swasta', 'baik', 'HM', 'layak'],
  [3, 'rendah', 'pengusaha', 'buruk', 'HM', 'tidak layak'],
  [4, 'rendah', 'pengusaha', 'baik', 'kontrak', 'layak'],
  [5, 'sedang', 'swasta', 'baik', 'kontrak', 'tidak layak'],
  [6, 'rendah', 'swasta', 'baik', 'HM', 'layak'],
  [7, 'rendah', 'ASN', 'buruk', 'HM', 'tidak layak'],
  [8, 'sedang', 'pengusaha', 'buruk', 'HM', 'layak'],
  [9, 'sedang', 'swasta', 'baik', 'HM', 'layak'],
  [10, 'sedang', 'pengusaha', 'buruk', 'kontrak', 'tidak layak'],
  [11, 'sedang', 'pengusaha', 'baik', 'kontrak', 'layak'],
  [12, 'tinggi', 'ASN', 'buruk', 'HM', 'layak'],
  [13, 'tinggi', 'pengusaha', 'buruk', 'kontrak', 'layak'],
  [14, 'tinggi', 'ASN', 'baik', 'HM', 'layak']
]


// let atribut = ['Cuaca', 'Suhu']
// let faktor = [1, 2]

// let Decision = new DTC45(atribut, data)
// let tree = Decision.BuildTree(data, faktor)
// console.log(JSON.stringify(tree));

// let atribut = ['Penghasilan', 'Pekerjaan', 'Hub Sosial', 'Status Rumah']
// let Decision = new DTC45(atribut, data1)
// let faktor1 = [1, 2, 3, 4]
// let tree = Decision.BuildTree(data1, faktor1)

// console.log(JSON.stringify(tree));

// let Penghasilan = Decision.SplitPartisi(data1, 1)
// let PenghasilanSedang = Penghasilan.sedang

// let StatusRumah = Decision.SplitPartisi(PenghasilanSedang, 4)


// let StatusRumahKontrak = StatusRumah.kontrak
// console.log(StatusRumahKontrak);

// console.log(Decision.GainRatio(StatusRumahKontrak, 3));

module.exports = DTC45