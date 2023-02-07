
fetch('/gempa?limit=90000')
  .then((response) => response.json())
  .then((dataGempa) => {
    let kekuatanGempa = []
    let kedalamanGempa = []
    let jarakGempa = []
    for (let d of dataGempa) {
      kekuatanGempa.push(d['kekuatanGempa'])
      kedalamanGempa.push(d['kedalamanGempa'])
      jarakGempa.push(d['jarakGempa'])
    }
    let trace1 = {
      y: kekuatanGempa,
      type: 'box',
      name: 'Kekuatan Gempa',
      marker: {
        color: 'rgb(107,174,214)'
      },
      boxpoints: 'Outliers'
    };

    let trace2 = {
      y: kedalamanGempa,
      type: 'box',
      name: 'Kedalaman',
      marker: {
        color: '#FF4136'
      },
      boxpoints: 'Outliers'
    };

    let trace3 = {
      y: jarakGempa,
      type: 'box',
      name: 'Jarak Pusat Gempa',
      marker: {
        color: '#FF851B'
      },
      boxpoints: 'Outliers'
    };

    var layout = {
      title: 'Box Plot'
    };



    Plotly.newPlot('boxplot1', [trace1, trace2, trace3], layout);

  })