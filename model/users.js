const User = require('./schemas/user')

async function findByEmail(email) {
  const user = await User.findOne({ email })

  return user
}

async function findById(id) {
  const user = await User.findOne({ _id: id })
  return user
}

async function createUser({ email, password }) {
  const user = new User({ email, password })
  return user.save()
}

async function updateToken(id, token) {
  return await User.updateOne({ _id: id }, { token })
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateToken,

}
