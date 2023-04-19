
const router = require("express").Router()
const { Api } = require("../../app/controller")



router.get("/decisiontree", Api.postDecisionTree)


module.exports = router




