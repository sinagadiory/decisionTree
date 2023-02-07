
const button = document.querySelector(".proses")
const input = document.querySelector("#k")

button.addEventListener("click", function () {
  window.location.href = "/evaluasidecisiontree/crossValidation?k=" + input.value
})