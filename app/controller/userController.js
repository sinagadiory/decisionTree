const jwt = require("jsonwebtoken")
const { userService } = require("../service")

class userController {

  static viewLogin(req, res) {
    res.render("User/login", { title: "Login", css: "login.css", error: null, input: null, js: null })
  }

  static async postLogin(req, res) {
    try {
      let user = await userService.login(req.body)
      if (user === false) throw new Error("email atau password tidak boleh kosong")
      if (user === null) throw new Error("email atau password salah")
      if (user.status === 'pending') throw new Error("Akun anda belum di aktifkan, hubungi super admin untuk di aktifkan")
      if (user.status === 'suspend') throw new Error("Akun anda di tanggungkan, hubungi super admin jika ini keliru")
      let token = jwt.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
      res
        .status(200)
        .cookie('access_token', token, {
          expires: new Date(Date.now() + 1 * 3600000) // cookie will be removed after 1 hours
        })
        .redirect(301, '/admin/register')

    } catch (error) {
      res.render("User/login", { title: "Login", css: "login.css", error: error.message, input: req.body, js: null })
    }
  }

  static viewRegister(req, res) {
    res.render("User/register", { title: "Register", css: "register.css", error: null, input: null, js: null })
  }

  static async postRegister(req, res) {
    const { name, email, password, confpassword } = req.body
    let request = { name, email, password, role: "admin", status: "pending" }
    try {
      if (password !== confpassword) throw { name: "err", message: "password dan konfirmasi password tidak sama" }
      if (!await userService.register(request)) throw { name: "err", message: "email sudah digunakan" }
      res.status(201).redirect("/admin/login")
    } catch (error) {
      let err = null
      if (error.name === 'err') err = error.message
      else err = error.errors[0].message
      res.render("User/register", { title: "Register", css: "register.css", error: err, input: req.body, js: null })
    }
  }

  static async updateStatus(req, res) {
    let user = await userService.findUser(req.user.email)
    let users = await userService.findUsersRoleAdmin()
    try {
      let userUpdate = await userService.findUserId(req.params.id)
      userUpdate.status = req.originalUrl.split("/")[1]
      userUpdate.id = req.params.id
      await userService.updateAdmin(userUpdate)
      if (!userUpdate) throw new Error("user tidak ditemukan")
      res.redirect("/superadmin")
    } catch (error) {
      console.log(error);
      res.render("superAdmin", { title: "SuperAdmin", css: null, user, usersAdmin: users, error: null, success: null, js: null })
    }
  }

  static async logout(req, res) {
    res.clearCookie("access_token", { path: "/" })
    res.redirect("/admin/login")
  }

}

module.exports = userController