const User = require('./schemas/user')

async function createUser(body) {
  const user = await User.create(body)
  return user
}

async function findByEmail(email) {
  const user = await User.findOne({ email })

  return user
}

async function findById(id) {
  const user = await User.findOne({ _id: id })
  return user
}

async function findByVerifyToken(verifyToken) {
  const user = await User.findOne({ verifyToken })
  return user
}

async function updateToken(id, token) {
  return await User.updateOne({ _id: id }, { token })
}

async function updateVerifyToken(id, verify, verifyToken) {
  return await User.findOneAndUpdate({ _id: id }, { verify, verifyToken })
}

async function updateSubscription(id, subscription) {
  return await User.updateOne({ _id: id }, { subscription })
}

async function updateAvatar(id, avatar) {
  return await User.updateOne({ _id: id }, { avatar })
}

module.exports = {
  findByEmail,
  findById,
  findByVerifyToken,
  createUser,
  updateToken,
  updateVerifyToken,
  updateSubscription,
  updateAvatar,

}
