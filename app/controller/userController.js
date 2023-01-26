const jwt = require("jsonwebtoken")
const { userService } = require("../service")

class userController {

  static viewLogin(req, res) {
    res.render("User/login", { title: "Login", css: "login.css", error: null })
  }

  static async postLogin(req, res) {
    try {
      let user = await userService.login(req.body)
      if (user === false) throw new Error("email atau password tidak boleh kosong")
      if (user === null) throw new Error("email atau password salah")
      let token = jwt.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
      res
        .status(200)
        .cookie('access_token', token, {
          expires: new Date(Date.now() + 1 * 3600000) // cookie will be removed after 1 hours
        })
        .redirect(301, '/admin/register')

    } catch (error) {
      res.render("User/login", { title: "Login", css: "login.css", error: error.message })
    }
  }

  static viewRegister(req, res) {
    res.render("User/register", { title: "Register", css: "register.css", error: null })
  }

  static async postRegister(req, res) {
    const { name, email, password, confpassword } = req.body
    let request = { name, email, password, role: "admin" }
    try {
      if (password !== confpassword) throw { name: "err", message: "password dan konfirmasi password tidak sama" }
      await userService.register(request)
      res.status(201).redirect("/admin/login")
    } catch (error) {
      let err = null
      if (error.name === 'err') err = error.message
      else err = error.errors[0].message
      res.render("User/register", { title: "Register", css: "register.css", error: err })
    }
  }

  static async logout(req, res) {
    res.clearCookie("access_token", { path: "/" })
    res.redirect("/admin/login")
  }

}

module.exports = userController