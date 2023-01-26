const { userRepository } = require("../repository")
const { compare } = require("../../helper")

class userService {

  static register(request) {
    return userRepository.create(request.name, request.email, request.password, request.role)
  }

  static async login(request) {
    if (!this.validateLogin(request)) return false
    let user = await userRepository.findOneEmail(request.email)
    if (!user) return null
    if (!compare(request.password, user.password)) return null
    return user
  }

  static validateLogin(request) {
    for (let r in request) if (!request[r]) return false
    return true
  }

  static findUser(email) {
    return userRepository.findOneEmail(email)
  }

  static findUsersRoleAdmin() {
    return userRepository.findAll()
  }

  static async deleteAdmin(id) {
    if (! await userRepository.findOne(id)) return null
    return userRepository.deleteAdmin(id)
  }
}

module.exports = userService