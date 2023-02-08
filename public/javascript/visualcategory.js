const ctxKekuatanGempa = document.getElementById('myChartKekuatanGempa');
const ctxKedalamanGempa = document.getElementById('myChartKedalamanGempa');
const ctxJarakGempa = document.getElementById("myChartJarakGempa")
const ctxDampakGempa = document.getElementById("myChartDampakGempa")
const typeButton = document.querySelector(".type")

const url = window.location.href.split("?")[1] ?? null

if (url) {
  typeButton.addEventListener("click", function () {
    window.location.href = "/visualcategory"
  })
  typeButton.textContent = 'Bar Chart'
} else {
  typeButton.addEventListener("click", function () {
    window.location.href = "/visualcategory?type=pie"
  })
  typeButton.textContent = 'Pie Chart'
}

fetch('/gempa?type=Category&limit=90000')
  .then((response) => response.json())
  .then((data) => {

    let kekuatanGempa = []
    let categoryKekuatanGempa = ['lemah', 'sedang', 'kuat']
    let JumlahKekuatanGempa = {}

    for (let item in categoryKekuatanGempa) {
      JumlahKekuatanGempa[categoryKekuatanGempa[item]] = 0
    }

    for (let d of data) {
      kekuatanGempa.push(d['kekuatanGempa'])
    }
    for (let item in JumlahKekuatanGempa) {
      for (let d of kekuatanGempa) {
        if (item === d) {
          JumlahKekuatanGempa[item] += 1
        }
      }
    }

    //Kedalaman Gempa
    let kedalamanGempa = []
    let categoryKedalamanGempa = ['dangkal', 'sedang', 'dalam']
    let JumlahKedalamanGempa = {}

    for (let item in categoryKedalamanGempa) {
      JumlahKedalamanGempa[categoryKedalamanGempa[item]] = 0
    }

    for (let d of data) {
      kedalamanGempa.push(d['kedalamanGempa'])
    }

    for (let item in JumlahKedalamanGempa) {
      for (let d of kedalamanGempa) {
        if (item.trim() == d.trim()) {
          JumlahKedalamanGempa[item] += 1
        }
      }
    }


    //Jarak Gempa
    let jarakGempa = []
    let categoryJarakGempa = ['dekat', 'sedang', 'jauh']
    let JumlahJarakGempa = {}

    for (let item in categoryJarakGempa) {
      JumlahJarakGempa[categoryJarakGempa[item]] = 0
    }

    for (let d of data) {
      jarakGempa.push(d['jarakGempa'])
    }

    for (let item in JumlahJarakGempa) {
      for (let d of jarakGempa) {
        if (item.trim() == d.trim()) {
          JumlahJarakGempa[item] += 1
        }
      }
    }

    //Dampak Gempa
    let DampakGempa = []
    let categoryDampakGempa = ['Not Felt', 'Felt', 'Slight Damage', 'Moderate Damage', 'Heavy Damage']
    let JumlahDampakGempa = {}

    for (let item in categoryDampakGempa) {
      JumlahDampakGempa[categoryDampakGempa[item]] = 0
    }

    for (let d of data) {
      DampakGempa.push(d['dampakGempa'])
    }

    for (let item in JumlahDampakGempa) {
      for (let d of DampakGempa) {
        if (item.trim() === d.trim()) {
          JumlahDampakGempa[item] += 1
        }
      }
    }


    //Tampilan
    if (typeButton.textContent === 'Pie Chart') {
      new Chart(ctxKekuatanGempa, {
        type: 'bar',
        data: {
          labels: categoryKekuatanGempa,
          datasets: [{
            label: "Kekuatan Gempa",
            data: JumlahKekuatanGempa,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
            ],
            borderWidth: 1
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

      //KedalamanGempa
      new Chart(ctxKedalamanGempa, {
        type: 'bar',
        data: {
          labels: categoryKedalamanGempa,
          datasets: [{
            label: "Kedalaman Gempa",
            data: JumlahKedalamanGempa,
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                // This more specific font property overrides the global property
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

      //Jarak Gempa
      new Chart(ctxJarakGempa, {
        type: 'bar',
        data: {
          labels: categoryJarakGempa,
          datasets: [{
            label: "Jarak Pusat Gempa",
            data: JumlahJarakGempa,
            backgroundColor: [
              'rgba(33, 61, 80, 0.2)',
              'rgba(20, 212, 43, 0.2)',
              'rgba(19, 214, 201, 0.2)'
            ],
            borderColor: [
              'rgba(33, 61, 80)',
              'rgba(20, 212, 43)',
              'rgba(19, 214, 201)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                // This more specific font property overrides the global property
                font: {
                  size: 15
                }
              },
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      //Dampak Gempa
      new Chart(ctxDampakGempa, {
        type: 'bar',
        data: {
          labels: categoryDampakGempa,
          datasets: [{
            label: "Dampak Gempa",
            data: JumlahDampakGempa,
            backgroundColor: [
              'rgba(101, 112, 112, 0.2)',
              'rgba(11, 243, 34, 0.227)',
              'rgba(239, 217, 19, 0.6)'
            ],
            borderColor: [
              'rgba(101, 112, 112)',
              'rgba(20, 212, 43)',
              'rgba(239, 217, 19)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                // This more specific font property overrides the global property
                font: {
                  size: 15
                }
              },
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      //Kekuatan Gempa
      new Chart(ctxKekuatanGempa, {
        type: 'pie',
        data: {
          labels: categoryKekuatanGempa,
          datasets: [{
            label: 'Kekuatan Gempa',
            data: [JumlahKekuatanGempa['lemah'], JumlahKekuatanGempa['sedang'], JumlahKekuatanGempa['kuat']],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Kekuatan Gempa',
              font: {
                size: 15
              }
            }
          }
        }
      });

      //Kedalaman Gempa
      new Chart(ctxKedalamanGempa, {
        type: 'pie',
        data: {
          labels: categoryKedalamanGempa,
          datasets: [{
            label: 'Kekuatan Gempa',
            data: [JumlahKedalamanGempa['dangkal'], JumlahKedalamanGempa['sedang'], JumlahKedalamanGempa['dalam']],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Kedalaman Gempa',
              font: {
                size: 15
              }
            }
          }
        }
      });

      //Jarak Gempa
      new Chart(ctxJarakGempa, {
        type: 'pie',
        data: {
          labels: categoryJarakGempa,
          datasets: [{
            label: 'Jarak Pusat Gempa',
            data: [JumlahJarakGempa['dekat'], JumlahJarakGempa['sedang'], JumlahJarakGempa['jauh']],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Jarak Pusat Gempa',
              font: {
                size: 15
              }
            }
          }
        }
      });


      //Dampak Gempa
      new Chart(ctxDampakGempa, {
        type: 'pie',
        data: {
          labels: categoryDampakGempa,
          datasets: [{
            label: 'Dampak Gempa',
            data: [JumlahDampakGempa['Not Felt'], JumlahDampakGempa['Felt'], JumlahDampakGempa['Slight Damage'], JumlahDampakGempa['Moderate Damage'], JumlahDampakGempa['Heavy Damage']],
            backgroundColor: [
              'rgb(205, 210, 210)',
              'rgb(41, 212, 41)',
              'yellow',
              'orange',
              'red'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Dampak Gempa',
              font: {
                size: 15
              }
            }
          }
        }
      });
    }
  });
