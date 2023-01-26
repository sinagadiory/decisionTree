// const { User } = require("../../models")
const { userService } = require("../service")

class homeController {

  static index(req, res) {
    res.render("home", { title: "Prediksi", css: null })
  }

  static async home(req, res) {
    let user = await userService.findUser(req.user.email)
    res.render("home", { title: "Home", css: null, user })
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
      res.render("superAdmin", { title: "SuperAdmin", css: null, user, usersAdmin: users, error: null, success: { message: "Berhasil dihapus", alert: "success" } })
    } catch (error) {
      res.render("superAdmin", { title: "SuperAdmin", css: null, user, usersAdmin: users, error, success: null })
    }
  }
}

module.exports = homeController