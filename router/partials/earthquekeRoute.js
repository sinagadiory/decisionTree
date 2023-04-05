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
router.get("/tabledecisiontree", earthquekeController.tableDecisionTree)
router.get("/unduhTableKnn", earthquekeController.unduhTableKnn)
router.get("/unduhTableDecisionTree", earthquekeController.unduhTableDT)
router.get("/evaluasiknn/splitvalidation", earthquekeController.evaluasiModel)
router.get("/evaluasiknn/crossvalidation", earthquekeController.evaluasiModelCrossValidation)
router.get("/evaluasidecisiontree/splitvalidation", earthquekeController.splitValidationDT)
router.get("/evaluasidecisiontree/crossvalidation", earthquekeController.evaluasiModelCrossValidationDT)

//post
router.post("/add/gempa", authMiddleware, earthquekeController.add)
router.post("/knn", earthquekeController.postKnn)
router.post("/update/gempa/:id", authMiddleware, earthquekeController.postUpdate)
router.post("/decisiontree", earthquekeController.postDecisionTree)

module.exports = router