

class crossValidation {
  findCenterRandom(data) {
    let index = Math.floor(Math.random() * (data.length - 1)) + 0
    return data[index]
  }

  systematicSample(data, n) {
    data.sort((a, b) => (a - b))

    let k = Math.floor(data.length / n)
    let result = []
    let i = Math.floor(Math.random() * (k - 1)) + 0

    let j = 0
    while (j < n) {
      result.push(data[i])
      i += k
      j++
    }
    return result
  }
}


module.exports = crossValidation