
const router = require("express").Router()

const { userRoute, homeRoute, earthquekeRoute } = require("./partials")


router.use(earthquekeRoute)
router.use("/admin", userRoute)
router.use(homeRoute)

router.use((req, res) => {
  res.render("notFound", { title: "NotFound", css: null })
})


module.exports = router