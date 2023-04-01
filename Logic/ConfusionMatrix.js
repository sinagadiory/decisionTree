
const DT = require("./DTC45")

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
  ['10', 'Hujan', 'Sejuk', 'Tidak']
]
let data1 = [
  ['Cerah', 'Panas', 'Tidak'],
  ['Cerah', 'Panas', 'Tidak'],
  ['Berawan', 'Panas', 'Ya'],
  ['Hujan', 'Sejuk', 'Ya'],
  ['Hujan', 'Dingin', 'Ya'],
  ['Hujan', 'Dingin', 'Ya'],
  ['Berawan', 'Dingin', 'Tidak'],
  ['Cerah', 'Sejuk', 'Ya'],
  ['Cerah', 'Dingin', 'Ya'],
  ['Hujan', 'Sejuk', 'Tidak']
]

class Matrix {
  constructor(data, modelPredict) {
    this.data = data
    this.kelas = this.FindClass(data)
    this.predicted = this.Predict(modelPredict)
    this.confusionMatrix = this.ConfusionMatrix()
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

  Predict(modelPredict) {
    let predicted = []
    for (let i = 0; i < this.data.length; i++) {
      predicted.push(modelPredict(this.data[i]))
    }
    return predicted
  }

  ConfusionMatrix() {
    let confusionMatrix = []
    for (let i = 0; i < this.kelas.length; i++) {
      confusionMatrix[i] = []
      for (let j = 0; j < this.kelas.length; j++) {
        confusionMatrix[i][j] = 0
      }
    }

    for (let i = 0; i < this.data.length; i++) {
      let trueClassIndex = this.kelas.indexOf(this.data[i][this.data[i].length - 1])
      let predictedClassIndex = this.kelas.indexOf(this.predicted[i])
      confusionMatrix[trueClassIndex][predictedClassIndex]++
    }
    return confusionMatrix
  }

  PrintConfusionMatrix() {
    console.log("Confusion Matrix:")
    console.log(this.kelas.join("\t"))
    for (let i = 0; i < this.confusionMatrix.length; i++) {
      console.log(this.confusionMatrix[i].join("\t"))
    }
  }

  Accuracy() {
    let correct = 0
    let total = 0
    for (let i = 0; i < this.confusionMatrix.length; i++) {
      for (let j = 0; j < this.confusionMatrix.length; j++) {
        if (i === j) correct += this.confusionMatrix[i][j]
        total += this.confusionMatrix[i][j]
      }
    }
    return correct / total
  }

  Precision() {
    let precision = []
    for (let i = 0; i < this.kelas.length; i++) {
      let tp = this.confusionMatrix[i][i]
      let fp = 0
      for (let j = 0; j < this.kelas.length; j++) {
        if (j !== i) fp += this.confusionMatrix[j][i]
      }
      precision.push(tp / (tp + fp))
    }
    return precision
  }

  Recall() {
    let recall = []
    for (let i = 0; i < this.kelas.length; i++) {
      let tp = this.confusionMatrix[i][i]
      let fn = 0
      for (let j = 0; j < this.kelas.length; j++) {
        if (j !== i) fn += this.confusionMatrix[i][j]
      }
      recall.push(tp / (tp + fn))
    }
    return recall
  }

}

const DTC45 = new DT(["Cuaca", "Suhu"], data)
const tree = DTC45.BuildTree(data, [1, 2])

function Model(kasus) {
  return DTC45.predict(tree, kasus)
}

// Buat objek Matrix
const matrix = new Matrix(data1, Model)

// Tampilkan confusion matrix
console.log(matrix.ConfusionMatrix());
// matrix.PrintConfusionMatrix()
// console.log(matrix.Accuracy());
// console.log(matrix.Precision());
// console.log(matrix.Recall());

module.exports = Matrix