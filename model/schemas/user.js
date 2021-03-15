
const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 8

const { Subscription } = require('../../helpers/constants')

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Set email for a user'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Set password for a user'],
  },
  subscription: {
    type: String,
    enum: [Subscription.FREE, Subscription.PRO, Subscription.PREMIUM],
    default: Subscription.FREE,
  },
  token: {
    type: String,
    default: null,
  },

},
{
  versionKey: false,
  timestamps: true,
})

userSchema.path('email').validate(function (value) {
  const re = /\S+@\S+\.\S+/
  return re.test(String(value).toLowerCase())
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
  this.password = await bcrypt.hash(this.password, salt, null)
  next()
})

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)
module.exports = User
