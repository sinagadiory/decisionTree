const ctxAccuracy = document.getElementById('myChartAccuracy');
const ctxPrecision = document.getElementById('myChartPrecision');
const ctxRecall = document.getElementById("myChartRecall")

const button = document.querySelector(".proses")
const input = document.querySelector("#k")

button.addEventListener("click", function () {
  window.location.href = "/confusionmatrix/performa/crossvalidation?k=" + input.value
})

let k = !window.location.href.split("=")[1] ? 10 : window.location.href.split("=")[1]

fetch("/data/confusionmatrix/crossvalidation?k=" + k)
  .then((response) => response.json())
  .then((data) => {

    for (let i = 0; i < data.length; i++) {
      document.querySelector("#acc" + i).innerHTML = (data[i].Accuracy * 100).toFixed(2) + "%"
    }

    for (let j = 0; j < data.length; j++) {
      document.querySelector("#pre" + j).innerHTML = (data[j].Precision * 100).toFixed(2) + "%"
    }

    for (let z = 0; z < data.length; z++) {
      document.querySelector("#rec" + z).innerHTML = (data[z].Recall * 100).toFixed(2) + "%"
    }
    let result = { accuracy: [], precision: [], recall: [] }
    let label = []

    for (let r = 0; r < data.length; r++) {
      result["accuracy"].push(data[r].Accuracy)
      result["precision"][r] = data[r].Precision
      result['recall'][r] = data[r].Recall
      label.push("Iterasi " + (r + 1))
    }
    new Chart(ctxAccuracy, {
      type: 'line',
      data: {
        labels: label,
        datasets: [{
          label: "Accuracy",
          data: result.accuracy,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: {
                size: 15
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });


    new Chart(ctxPrecision, {
      type: 'line',
      data: {
        labels: label,
        datasets: [{
          label: "Precision",
          data: result.precision,
          borderColor: 'rgba(20, 212, 43)',
          tension: 0.1
        }]
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: {
                size: 15
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    new Chart(ctxRecall, {
      type: 'line',
      data: {
        labels: label,
        datasets: [{
          label: "Recall",
          data: result.recall,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }]
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: {
                size: 15
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  })