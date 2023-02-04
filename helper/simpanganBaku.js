
function simpanganBaku(data) {
  const sum = data.reduce((partialSum, a) => partialSum + a, 0);
  const rata2 = sum / data.length
  let result = 0
  data.map((d) => {
    result += ((d - rata2) ** 2)
  })
  return Math.sqrt(result / (data.length - 1)).toFixed(2)
}


module.exports = simpanganBaku