const ctxAccuracy = document.getElementById('myChartAccuracy');
const ctxPrecision = document.getElementById('myChartPrecision');
const ctxRecall = document.getElementById("myChartRecall")





fetch("/data/confusionmatrix/splitvalidation")
  .then((response) => response.json())
  .then((data) => {
    document.querySelector("#acc6").innerHTML = (data.accuracy[0] * 100).toFixed(2) + "%"
    document.querySelector("#acc7").innerHTML = (data.accuracy[1] * 100).toFixed(2) + "%"
    document.querySelector("#acc8").innerHTML = (data.accuracy[2] * 100).toFixed(2) + "%"
    document.querySelector("#acc9").innerHTML = (data.accuracy[3] * 100).toFixed(2) + "%"

    document.querySelector("#pre6").innerHTML = (data.precision[0] * 100).toFixed(2) + "%"
    document.querySelector("#pre7").innerHTML = (data.precision[1] * 100).toFixed(2) + "%"
    document.querySelector("#pre8").innerHTML = (data.precision[2] * 100).toFixed(2) + "%"
    document.querySelector("#pre9").innerHTML = (data.precision[3] * 100).toFixed(2) + "%"

    document.querySelector("#rec6").innerHTML = (data.recall[0] * 100).toFixed(2) + "%"
    document.querySelector("#rec7").innerHTML = (data.recall[1] * 100).toFixed(2) + "%"
    document.querySelector("#rec8").innerHTML = (data.recall[2] * 100).toFixed(2) + "%"
    document.querySelector("#rec9").innerHTML = (data.recall[3] * 100).toFixed(2) + "%"
    new Chart(ctxAccuracy, {
      type: 'line',
      data: {
        labels: ["Split 6:4", "Split 7:3", 'Split 8:2', "Split 9:1"],
        datasets: [{
          label: "Accuracy",
          data: data.accuracy,
          // backgroundColor: [
          //   'rgba(54, 162, 235, 0.2)',
          //   'rgba(153, 102, 255, 0.2)',
          //   'rgba(201, 203, 207, 0.2)',
          //   'rgba(255, 205, 86, 0.2)',
          // ],
          // borderColor: [
          //   'rgba(54, 162, 235)',
          //   'rgba(153, 102, 255)',
          //   'rgba(201, 203, 207)',
          //   'rgba(255, 205, 86)',
          // ],
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
        labels: ["Split 6:4", "Split 7:3", 'Split 8:2', "Split 9:1"],
        datasets: [{
          label: "Precision",
          data: data.precision,
          // backgroundColor: [
          //   'rgba(33, 61, 80, 0.2)',
          //   'rgba(20, 212, 43, 0.2)',
          //   'rgba(19, 214, 201, 0.2)',
          //   'rgba(255, 205, 86, 0.2)',
          // ],
          // borderColor: [
          //   'rgba(33, 61, 80)',
          //   'rgba(20, 212, 43)',
          //   'rgba(19, 214, 201)',
          //   'rgb(255, 205, 86)',
          // ],
          // borderWidth: 1
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
        labels: ["Split 6:4", "Split 7:3", 'Split 8:2', "Split 9:1"],
        datasets: [{
          label: "Recall",
          data: data.recall,
          // backgroundColor: [
          //   'rgba(255, 99, 132, 0.2)',
          //   'rgba(255, 159, 64, 0.2)',
          //   'rgba(19, 214, 201, 0.2)',
          //   'rgba(255, 205, 86, 0.2)',
          // ],
          // borderColor: [
          //   'rgb(255, 99, 132)',
          //   'rgb(255, 159, 64)',
          //   'rgba(19, 214, 201)',
          //   'rgb(255, 205, 86)',
          // ],
          // borderWidth: 1
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