
const search = document.querySelector(".search")
const hasil = document.querySelector(".hasil")
const row = document.querySelector(".row")

var xhr = new XMLHttpRequest();

const BarisGempa = (data, no) => {
  return `
    <tr>
      <th scope="row">${no}</th>
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
    let no = 1
    if (this.readyState === 4 && this.status === 200) {
      let data = JSON.parse(this.responseText)
      let result = ""
      for (let d of data) {
        result += BarisGempa(d, no)
        no++
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
  let url = window.location.href.split("?")[1] !== "type=Category" ? "/gempa?limit=" : "/gempa?type=Category&limit=";
  xhr.onreadystatechange = function () {
    let no = 1
    if (this.readyState === 4 && this.status === 200) {
      let data = JSON.parse(this.responseText)
      let result = ""
      for (let d of data) {
        result += BarisGempa(d, no)
        no++
      }
      hasil.innerHTML = result;
    }
  };
  xhr.open("GET", url + select.value, true);
  xhr.send()
})
