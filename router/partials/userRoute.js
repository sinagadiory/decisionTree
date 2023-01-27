const router = require("express").Router()
const { userController } = require("../../app/controller")


const { notLoginMiddleware } = require("../../app/middleware")



//Get Method
router.get("/login", notLoginMiddleware, userController.viewLogin)
router.get("/register", notLoginMiddleware, userController.viewRegister)


//Post Method
router.post("/login", notLoginMiddleware, userController.postLogin)
router.post("/register", notLoginMiddleware, userController.postRegister)



module.exports = router