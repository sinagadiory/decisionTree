const router = require("express").Router()

const { homeController, userController } = require("../../app/controller")
const { superAdmin } = require("../../app/middleware")

router.get("/home", homeController.home)
router.get("/logout", userController.logout)

router.use(superAdmin)
router.get("/superAdmin", homeController.superAdmin)
router.get("/delete/admin/:id", homeController.deleteAdmin)

module.exports = router