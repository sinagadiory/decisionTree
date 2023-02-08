// const { User } = require("../../models")
const { userService } = require("../service")
const { Earthquake } = require("../../models")
let { Clustering } = require("../../Logic/index")
class homeController {

  static async index(req, res) {

    let { type = "Not Category" } = req.query
    let Earthquakes = await Earthquake.findAll({ limit: 7, order: [['id', 'ASC']] })
    let data = []
    for (let gempa of Earthquakes) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }

    let kekuatanGempa = []
    let kedalamanGempa = []
    let jarakGempa = []

    for (let d of data) {
      kekuatanGempa.push(+d[1])
      kedalamanGempa.push(+d[2])
      jarakGempa.push(+d[3])
      d[1] = +d[1]
      d[2] = +d[2]
      d[3] = +d[3]
    }
    //Kategori
    let kategoriKekuatan = ["lemah", 'sedang', 'kuat']
    let kategoriKedalaman = ['dangkal', 'sedang', 'dalam']
    let kategoriJarakGempa = ['dekat', 'sedang', 'jauh']

    let cluster = new Clustering()
    //Cluster
    let clusterKekuatan = cluster.kMeans(kekuatanGempa, kategoriKekuatan.length)
    let clusterKedalaman = cluster.kMeans(kedalamanGempa, kategoriKedalaman.length)
    let clusterJarakGempa = cluster.kMeans(jarakGempa, kategoriJarakGempa.length)

    if (type === 'Category') {
      for (let gempa of Earthquakes) {
        gempa['kekuatanGempa'] = kategoriKekuatan[cluster.findCluster(gempa['kekuatanGempa'], clusterKekuatan.centroids)]
        gempa['kedalamanGempa'] = kategoriKedalaman[cluster.findCluster(gempa['kedalamanGempa'], clusterKedalaman.centroids)]
        gempa['jarakGempa'] = kategoriJarakGempa[cluster.findCluster(gempa['jarakGempa'], clusterJarakGempa.centroids)]
      }
    }
    res.render("index", { title: "Prediksi Gempa di Indonesia", css: "index.css", data: Earthquakes, js: "index.js" })
  }

  static async home(req, res) {
    let { type = "Not Category" } = req.query
    let Earthquakes = await Earthquake.findAll({ limit: 7, order: [['id', 'ASC']] })
    let data = []
    for (let gempa of Earthquakes) {
      data.push([gempa.lokasi, gempa.kekuatanGempa, gempa.kedalamanGempa, gempa.jarakGempa, gempa.dampakGempa])
    }

    let kekuatanGempa = []
    let kedalamanGempa = []
    let jarakGempa = []

    for (let d of data) {
      kekuatanGempa.push(+d[1])
      kedalamanGempa.push(+d[2])
      jarakGempa.push(+d[3])
      d[1] = +d[1]
      d[2] = +d[2]
      d[3] = +d[3]
    }
    //Kategori
    let kategoriKekuatan = ["lemah", 'sedang', 'kuat']
    let kategoriKedalaman = ['dangkal', 'sedang', 'dalam']
    let kategoriJarakGempa = ['dekat', 'sedang', 'jauh']

    let cluster = new Clustering()
    //Cluster
    let clusterKekuatan = cluster.kMeans(kekuatanGempa, kategoriKekuatan.length)
    let clusterKedalaman = cluster.kMeans(kedalamanGempa, kategoriKedalaman.length)
    let clusterJarakGempa = cluster.kMeans(jarakGempa, kategoriJarakGempa.length)

    if (type === 'Category') {
      for (let gempa of Earthquakes) {
        gempa['kekuatanGempa'] = kategoriKekuatan[cluster.findCluster(gempa['kekuatanGempa'], clusterKekuatan.centroids)]
        gempa['kedalamanGempa'] = kategoriKedalaman[cluster.findCluster(gempa['kedalamanGempa'], clusterKedalaman.centroids)]
        gempa['jarakGempa'] = kategoriJarakGempa[cluster.findCluster(gempa['jarakGempa'], clusterJarakGempa.centroids)]
      }
    }
    let user = await userService.findUser(req.user.email)
    if (user.status !== 'active') {
      res.clearCookie("access_token")
      res.redirect("/admin/login")
      return
    }
    res.render("home", { title: "Home", css: "home.css", user, error: null, data: Earthquakes, js: "home.js" })
  }

  static async superAdmin(req, res) {
    let user = await userService.findUser(req.user.email)
    let users = await userService.findUsersRoleAdmin()
    res.render("superAdmin", { title: "SuperAdmin", css: null, user, usersAdmin: users, error: null, success: null, js: null })
  }

  static async deleteAdmin(req, res) {
    let { id } = req.params
    let user = await userService.findUser(req.user.email)
    let users = await userService.findUsersRoleAdmin()
    try {
      if (! await userService.deleteAdmin(id)) throw { message: "user tidak ditemukan", alert: "danger" }
      res.redirect("/superadmin")
    } catch (error) {
      res.render("superAdmin", { title: "SuperAdmin", css: null, user, usersAdmin: users, error, success: null, js: null })
    }
  }
}

module.exports = homeController