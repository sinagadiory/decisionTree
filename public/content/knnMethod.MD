#### KNN METHOD

***Perhitungan Euclid Distance***
```javascript
  EuclideanDistance(x, y) {
    let result = 0
    for (let i = 0; i < x.length; i++) {
      result += (x[i] - y[i]) ** 2
    }
    return Math.sqrt(result)
  }
```