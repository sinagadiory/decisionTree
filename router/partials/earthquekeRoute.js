const router = require("express").Router()
const { earthquekeController } = require("../../app/controller")

//get
router.get("/search", earthquekeController.search)
router.get("/gempa", earthquekeController.show)
router.get("/unduh", earthquekeController.unduh)
router.get("/knn", earthquekeController.KNN)
router.get("/decisiontree", earthquekeController.DecicionTree)

//post
router.post("/add/gempa", earthquekeController.add)
router.post("/knn", earthquekeController.postKnn)


module.exports = router