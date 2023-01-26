

function superAdmin(req, res, next) {
  let user = req.user
  if (user.role !== 'superadmin') res.redirect("/home")
  else next()
}


module.exports = superAdmin