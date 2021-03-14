const jwt = require('jsonwebtoken')
const Users = require('../model/users')
require('dotenv').config()
const { HttpCode } = require('../helpers/constants')
const SECRET_KEY = process.env.JWT_SECRET

const reg = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await Users.findByEmail(email)

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email in use',
      })
    }

    const newUser = await Users.createUser(req.body)

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
      },
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isPasswordValid = await user.validPassword(password)

    if (!user || !isPasswordValid) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      })
    }

    const id = user._id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
    await Users.updateToken(id, token)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
      },
    })
  } catch (e) {
    next(e)
  }
}

const logout = async (req, res, next) => { }
const current = async (req, res, next) => { }

module.exports = {
  reg,
  login,
  logout,
  current,
}
