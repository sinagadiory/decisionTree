const router = require("express").Router()
const { earthquekeController } = require("../../app/controller")
const { authMiddleware } = require("../../app/middleware")

//get
router.get("/search", earthquekeController.search)
router.get("/gempa", earthquekeController.show)
router.get("/unduh", earthquekeController.unduh)
router.get("/knn", earthquekeController.KNN)
router.get("/decisiontree", earthquekeController.DecicionTree)
router.get("/update/gempa/:id", authMiddleware, earthquekeController.update)
router.get("/tableKnn", earthquekeController.tableKnn)
router.get("/unduhTableKnn", earthquekeController.unduhTableKnn)
router.get("/evaluasi/splitvalidation", earthquekeController.evaluasiModel)
router.get("/evaluasi/crossvalidation", earthquekeController.evaluasiModelCrossValidation)

//post
router.post("/add/gempa", earthquekeController.add)
router.post("/knn", earthquekeController.postKnn)
router.post("/update/gempa/:id", authMiddleware, earthquekeController.postUpdate)


module.exports = router