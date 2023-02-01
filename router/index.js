
const router = require("express").Router()

const { userRoute, homeRoute, earthquekeRoute, contentRoute } = require("./partials")

router.use(contentRoute)
router.use(earthquekeRoute)
router.use("/admin", userRoute)
router.use(homeRoute)

router.use((req, res) => {
  res.render("notFound", { title: "NotFound", css: null, js: null })
})


module.exports = router