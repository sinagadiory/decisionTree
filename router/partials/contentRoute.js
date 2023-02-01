const router = require("express").Router()
const { contentController } = require("../../app/controller")


router.get("/knnMethod", contentController.knnMethod)

module.exports = router