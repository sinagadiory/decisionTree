const Clustering = require("./Clustering")
const crossValidation = require("./crossValidation")
const DTC45 = require("./DTC45")
const KNN = require("./KNN")
const splitValidation = require("./splitValidation")
const Matrix = require("./ConfusionMatrix")
const MatchDampakGempa = require("./helper")
const jarakGempaEasy = require("./jarakGempaEasy")


module.exports = {
  Clustering, crossValidation, DTC45, KNN, splitValidation, Matrix, MatchDampakGempa, jarakGempaEasy
}