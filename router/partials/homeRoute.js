const router = require("express").Router()

const { homeController, userController } = require("../../app/controller")
const { superAdmin, authMiddleware } = require("../../app/middleware")


router.get("/", homeController.index)
router.get("/home", authMiddleware, homeController.home)
router.get("/logout", authMiddleware, userController.logout)
router.get("/datanew", homeController.dataNew)

router.get("/superAdmin", authMiddleware, superAdmin, homeController.superAdmin)
router.get("/delete/admin/:id", authMiddleware, superAdmin, homeController.deleteAdmin)

router.get("/active/admin/:id", authMiddleware, superAdmin, userController.updateStatus)
router.get("/suspend/admin/:id", authMiddleware, superAdmin, userController.updateStatus)

module.exports = router