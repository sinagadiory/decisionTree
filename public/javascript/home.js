
const search = document.querySelector(".search")
const hasil = document.querySelector(".hasil")
const add = document.querySelector(".add")
const row = document.querySelector(".row")
const time = document.querySelector(".time")

setInterval(() => {
  const timeNow = new Date().toLocaleTimeString()
  time.innerHTML = `<h5>${timeNow}</h5>`
}, 1000)

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
      <td>
        <a href="/delete/gempa/${data.id}" class="btn btn-outline-danger btn-sm"><i class="bi bi-trash"></i></a>
        <a href="/update/gempa/${data.id}" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-pen"></i></a>
      </td>
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

add.addEventListener("click", function (e) {
  e.preventDefault()
  let content = `
  <div class="col-lg-7">
  <button id="show" class="btn btn-info text-white btn-sm" style="text-decoration: none;" href=""><i class="fa-solid fa-table"></i> Show Table</button>
    <form style="width: 80%;" method="POST" action="/add/gempa">
      <label id="lokasi" class="form-label" for="lokasi">Lokasi</label>
      <input class="form-control" type="text" name="lokasi">
      <label id="kekuatanGempa" class="form-label" for="kekuatanGempa">Kekuatan Gempa</label>
      <input class="form-control" type="text" name="kekuatanGempa">
      <label id="kedalamanGempa" class="form-label" for="kedalamanGempa">Kedalaman Gempa</label>
      <input class="form-control" type="text" name="kedalamanGempa">
      <label id="jarakGempa" class="form-label" for="jarakGempa">Jarak Pusat Gempa</label>
      <input class="form-control" type="text" name="jarakGempa">
      <div class="input-group mt-3">
        <select name="dampakGempa" class="form-select" id="inputGroupSelect01">
          <option hidden>Dampak Gempa</option>
          <option value="Not Fealt">Not Fealt</option>
          <option style="background-color: rgb(41, 212, 41);" value="Fealt">Fealt</option>
          <option style="background-color:yellow;" value="Slight Demage">Slight Demage </option>
          <option style="background-color: orange;" value="Moderate Demage">Moderate Demage </option>
          <option class="text-white" style="background-color:red" value="Heavy Demage">Heavy Demage </option>
        </select>
      </div>
      <button class="form-control btn btn-warning mt-3"><i class="fa-solid fa-plus"></i> Tambah</button>
    </form>
  </div>
  <div class="col-lg-5 align-self-center">
    <h1>Tambah Data Gempa</h1>
  </div>
  `
  row.innerHTML = content
  const show = document.querySelector("#show")
  show.addEventListener("click", function () {
    window.location.href = "/home"
  })
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
