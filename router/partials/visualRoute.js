const route = require("express").Router()
const { visualController } = require("../../app/controller")

route.get("/visualcategory", visualController.barCategory)

route.get("/statistic", visualController.statistic)

module.exports = route