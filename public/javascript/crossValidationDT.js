
const button = document.querySelector(".proses")
const input = document.querySelector("#k")

button.addEventListener("click", function () {
  if (input.value > 0) {
    window.location.href = "/evaluasidecisiontree/crossValidation?k=" + input.value
  } else {
    alert("Inputan anda salah")
  }
})