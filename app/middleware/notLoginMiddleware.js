const jwt = require("jsonwebtoken")

function notLoginMiddleware(req, res, next) {
  let { access_token } = req.cookies
  // if (!access_token) next()
  try {
    jwt.verify(access_token, process.env.ACCESS_TOKEN)
    res.redirect("/home")
  } catch (error) {
    next()
  }
}

module.exports = notLoginMiddleware