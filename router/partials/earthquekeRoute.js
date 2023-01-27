const router = require("express").Router()
const { earthquekeController } = require("../../app/controller")


router.get("/gempa", earthquekeController.show)
router.get("/unduh", earthquekeController.unduh)

module.exports = router