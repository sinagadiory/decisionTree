const router = require("express").Router()
const { userController } = require("../../app/controller")


const { notLoginMiddleware } = require("../../app/middleware")


router.use(notLoginMiddleware)
//Get Method
router.get("/login", userController.viewLogin)
router.get("/register", userController.viewRegister)


//Post Method
router.post("/login", userController.postLogin)
router.post("/register", userController.postRegister)



module.exports = router