
const router = require("express").Router()

const { userRoute, homeRoute, earthquekeRoute, contentRoute, visualRoute, apiRoute } = require("./partials")

router.use(contentRoute)
router.use(earthquekeRoute)
router.use(visualRoute)
router.use("/admin", userRoute)
router.use(homeRoute)
router.use("/api", apiRoute)

router.use((req, res) => {
  res.render("notFound", { title: "NotFound", css: null, js: null })
})


module.exports = router