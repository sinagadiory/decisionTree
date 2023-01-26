
const router = require("express").Router()

const { userRoute, homeRoute } = require("./partials")
const { authMiddleware, superAdmin } = require("../app/middleware")


router.use("/admin", userRoute)
router.use(authMiddleware, homeRoute)

router.use((req, res) => {
  res.render("notFound", { title: "Not Found", css: null })
})

module.exports = router