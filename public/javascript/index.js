
const search = document.querySelector(".search")
const hasil = document.querySelector(".hasil")
const row = document.querySelector(".row")

var xhr = new XMLHttpRequest();

const BarisGempa = (data) => {
  return `
    <tr>
      <th scope="row">${data.id}</th>
      <td>${data.lokasi}</td>
      <td>${data.kekuatanGempa}</td>
      <td>${data.kedalamanGempa}</td>
      <td>${data.jarakGempa} </td>
      <td>${data.dampakGempa}</td>
    </tr>
  `
}

search.addEventListener("keyup", function (e) {
  e.preventDefault()
  let url = "/search?keyword=";
  xhr.onreadystatechange = function () {
    let id = 1
    if (this.readyState === 4 && this.status === 200) {
      let data = JSON.parse(this.responseText)
      let result = ""
      for (let d of data) {
        d.id = id++
        result += BarisGempa(d)
      }
      hasil.innerHTML = result;
    }
  };
  xhr.open("GET", url + search.value, true);
  xhr.send()
})

const select = document.querySelector("select")

select.addEventListener('click', function (e) {
  e.preventDefault()
  if (select.value === 'Show') select.value = 7
  let url = "/gempa?limit=";
  xhr.onreadystatechange = function () {
    let id = 1
    if (this.readyState === 4 && this.status === 200) {
      let data = JSON.parse(this.responseText)
      let result = ""
      for (let d of data) {
        d.id = id++
        result += BarisGempa(d)
      }
      hasil.innerHTML = result;
    }
  };
  xhr.open("GET", url + select.value, true);
  xhr.send()
})
