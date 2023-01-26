

class Clustering {

  EuclideanDistance(x, y) {
    let result = 0
    for (let i = 0; i < x.length; i++) {
      result += (x[i] - y[i]) ** 2
    }
    return Math.sqrt(result)
  }

  Mean(data) {
    let sum = 0
    for (let d of data) {
      sum += d
    }
    return sum / data.length
  }

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

  findCluster(titik, centroids) {
    let min = Infinity
    let index = null
    for (let i = 0; i < centroids.length; i++) {
      if (this.EuclideanDistance([titik], [centroids[i]]) < min) {
        min = this.EuclideanDistance([titik], [centroids[i]])
        index = i
      }
    }
    return index
  }

  sameArray(arr1, arr2) {
    if (arr1.length !== arr2.length) return false
    let sum = 0
    arr1.sort((a, b) => (a - b))
    arr2.sort((a, b) => (a - b))

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] === arr2[i]) sum += 1
    }
    return sum === arr1.length ? true : false
  }

  kMeans(data, k, systematicSample = false) {
    let clusters = []
    let centroids = []
    let check = []
    let i = 0
    while (i < k) {
      if (systematicSample) {
        let sample = this.systematicSample(data, k)
        for (let s of sample) {
          centroids.push(s)
          i++
        }
      } else {
        let random = this.findCenterRandom(data)
        if (!centroids.some((c) => (c == random))) {
          centroids.push(random)
          i++
        }
      }
    }

    centroids.sort((a, b) => (a - b))

    for (let i = 0; i < centroids.length; i++) {
      clusters.push([])
      check.push([])
    }

    while (true) {
      for (let j = 0; j < centroids.length; j++) {
        check[j] = clusters[j]
        clusters[j] = []
      }

      for (let i = 0; i < data.length; i++) {
        let index = this.findCluster(data[i], centroids)
        clusters[index].push(data[i])
      }

      for (let j = 0; j < centroids.length; j++) {
        centroids[j] = this.Mean(clusters[j])
      }
      let result = 0
      for (let i = 0; i < clusters.length; i++) {
        if (this.sameArray(clusters[i], check[i])) {
          if (this.Mean(clusters[i]) === this.Mean(check[i])) {
            result += 1
          }
        }
      }

      if (result === clusters.length) {
        break
      }
    }

    for (let cluster of clusters) {
      cluster.sort((a, b) => (a - b))
    }


    return clusters
  }
}


let clustering = new Clustering()

// console.log(clustering.kMeans([16, 16, 17, 20, 20, 21, 21, 22, 23, 29, 36, 41, 42, 43, 44, 45, 61, 62, 66], 2, true));
// console.log("------------------");
// console.log(clustering.kMeans([16, 16, 17, 20, 20, 21, 21, 22, 23, 29, 36, 41, 42, 43, 44, 45, 61, 62, 66], 2, false));

// console.log(clustering.kMeans([22, 1, 4, 5, 2, 12, 90, 100, 23, 54, 65, 34, 56], 2, false));

// console.log("----------------------------");
// console.log(clustering.kMeans([22, 1, 4, 5, 2, 12, 90, 100, 23, 54, 65, 34, 56], 2, true));


module.exports = Clustering