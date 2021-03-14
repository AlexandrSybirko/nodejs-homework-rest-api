const passport = require('passport')
require('../config/passport')
const { HttpCode } = require('./constants')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(HttpCode.FORBIDDEN).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Forbidden',
        message: 'Email or password is wrong',
      })
    }

    req.user = user
    return next()
  })(req, res, next)
}

module.exports = guard
