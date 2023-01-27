// const { User } = require("../../models")
const { userService } = require("../service")
const { Earthquake } = require("../../models")
class homeController {

  static async index(req, res) {
    let limit = !req.query.limit ? 7 : req.query.limit
    let Earthquakes = await Earthquake.findAll({ limit })
    res.render("index", { title: "Prediksi Gempa di Indonesia", css: "index.css", data: Earthquakes })
  }

  static async home(req, res) {
    let limit = !req.query.limit ? 7 : req.query.limit
    let Earthquakes = await Earthquake.findAll({ limit })
    let user = await userService.findUser(req.user.email)
    if (user.status !== 'active') {
      res.clearCookie("access_token")
      res.redirect("/admin/login")
      return
    }
    res.render("home", { title: "Home", css: "home.css", user, data: Earthquakes })
  }

  static async superAdmin(req, res) {
    let user = await userService.findUser(req.user.email)
    let users = await userService.findUsersRoleAdmin()
    res.render("superAdmin", { title: "SuperAdmin", css: null, user, usersAdmin: users, error: null, success: null })
  }

  static async deleteAdmin(req, res) {
    let { id } = req.params
    let user = await userService.findUser(req.user.email)
    let users = await userService.findUsersRoleAdmin()
    try {
      if (! await userService.deleteAdmin(id)) throw { message: "user tidak ditemukan", alert: "danger" }
      res.redirect("/superadmin")
    } catch (error) {
      res.render("superAdmin", { title: "SuperAdmin", css: null, user, usersAdmin: users, error, success: null })
    }
  }
}

module.exports = homeController