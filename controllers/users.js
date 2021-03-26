const jwt = require('jsonwebtoken')
const fs = require('fs').promises
const path = require('path')
const Jimp = require('jimp')
const Users = require('../model/users')
require('dotenv').config()
const { nanoid } = require('nanoid')
const { HttpCode } = require('../helpers/constants')
const EmailService = require('../services/email')
const createFolderIsExist = require('../helpers/create-dir')
const SECRET_KEY = process.env.JWT_SECRET

const reg = async (req, res, next) => {
  try {
    const { email, name } = req.body
    const user = await Users.findByEmail(email)

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email in use',
      })
    }
    const verifyToken = nanoid()
    const emailService = new EmailService(process.env.NODE_ENV)
    await emailService.sendEmail(verifyToken, email, name)
    const newUser = await Users.createUser({
      ...req.body,
      verify: false,
      verifyToken,
    })

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatar,
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
    const isPasswordValid = await user?.validPassword(password)

    if (!user || !isPasswordValid || !user.verify) {
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

const logout = async (req, res, next) => {
  try {
    const id = req.user.id
    await Users.updateToken(id, null)
    return res.status(HttpCode.NO_CONTENT).json({ message: 'Not authorized' })
  } catch (e) {
    next(e)
  }
}

const current = async (req, res, next) => {
  try {
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        id: req.user.id,
        email: req.user.email,
        subscription: req.user.subscription,
      },
    })
  } catch (e) {
    next(e)
  }
}

const updateSubscription = async (req, res, next) => {
  try {
    const id = req.user.id
    const subscription = req.body.subscription
    await Users.updateSubscription(id, subscription)

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        id: req.user.id,
        email: req.user.email,
        subscription,
      },
    })
  } catch (e) {
    next(e)
  }
}

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id
    const avatarUrl = await saveAvatarToStatic(req)
    await Users.updateAvatar(id, avatarUrl)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarUrl, },
    })
  } catch (e) {
    next(e)
  }
}

const saveAvatarToStatic = async (req) => {
  const id = req.user.id
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS
  const pathFile = req.file.path
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`
  const img = await Jimp.read(pathFile)
  await img.autocrop().cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE).writeAsync(pathFile)
  await createFolderIsExist(path.join(AVATARS_OF_USERS, id))
  await fs.rename(pathFile, path.join(AVATARS_OF_USERS, id, newNameAvatar))
  const avatarUrl = path.normalize(path.join(id, newNameAvatar))
  try {
    await fs.unlink(path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatar))
  } catch (e) {
    console.log(e.message)
  }
  return avatarUrl
}

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.token)
    if (user) {
      await Users.updateVerifyToken(user._id, true, null);

      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Verification successful',
      })

    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'Bad request',
      message: 'Link is not valid',
    })
    
  } catch (error) {
    
  }
}

module.exports = {
  reg,
  login,
  logout,
  current,
  updateSubscription,
  avatars,
  verify,
}
