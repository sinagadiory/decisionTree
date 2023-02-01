const jwt = require("jsonwebtoken")

function authMiddleware(req, res, next) {
  let { access_token } = req.cookies
  if (!access_token) {
    res.redirect("/admin/login")
    return
  }
  try {
    let user = jwt.verify(access_token, process.env.ACCESS_TOKEN)
    req.user = user
    next()
  } catch (error) {
    res.redirect("/admin/login")
    return
  }
}

module.exports = authMiddleware