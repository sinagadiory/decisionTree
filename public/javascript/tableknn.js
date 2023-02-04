const proses = document.querySelector(".proses")
const input = document.querySelector("#k")

const url = window.location.href

proses.addEventListener("click", function () {
  proses.innerHTML = "Loading..."
  window.location.href = `${url}` + `&k=${input.value}`
})