const { userRepository } = require("../repository")
const { compare } = require("../../helper")

class userService {

  static async register(request) {
    let user = await userRepository.findOneEmail(request.email)
    if (user) return false
    return userRepository.create(request.name, request.email, request.password, request.role, request.status)
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

  static findUserId(id) {
    return userRepository.findOne(id)
  }

  static findUsersRoleAdmin() {
    return userRepository.findAll()
  }

  static async deleteAdmin(id) {
    if (! await userRepository.findOne(id)) return null
    return userRepository.deleteAdmin(id)
  }

  static async updateAdmin(request) {
    if (!await userRepository.findOne(request.id)) return null
    return userRepository.update(request.name, request.email, request.role, request.status, request.id)
  }
}

module.exports = userService