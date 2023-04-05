const route = require("express").Router()
const { visualController, earthquekeController } = require("../../app/controller")

route.get("/visualcategory", visualController.barCategory)

route.get("/statistic", visualController.statistic)


route.get("/confusionmatrix/performa/splitvalidation", visualController.VisualConfusionMatrix)
route.get("/data/confusionmatrix/splitvalidation", earthquekeController.ReturnConfusionMatrixsplitValidationDT)


route.get("/confusionmatrix/performa/crossvalidation", visualController.VisualConfusionMatrixCV)
route.get("/data/confusionmatrix/crossvalidation", earthquekeController.returnConfusionMatrixCrossValidation)
module.exports = route