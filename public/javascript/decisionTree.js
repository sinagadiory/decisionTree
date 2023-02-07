const prosesKnn = document.querySelector(".prosesDT")
const form = document.querySelector("form")
const content = document.querySelector(".content")

prosesKnn.addEventListener("click", function () {
  prosesKnn.innerHTML = "Loading..."
  content.innerHTML = '<img style="max-width: 90%;" src="/static/mikir.jpg" alt=""><br>'
})