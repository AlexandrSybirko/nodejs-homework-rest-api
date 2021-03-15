const express = require('express')
const router = express.Router()
const guard = require('../../../helpers/guard')
const validate = require('./validation')

const userController = require('../../../controllers/users')

router.post('/registration', validate.createUser, userController.reg)
router.post('/login', userController.login)
router.post('/logout', guard, userController.logout)
router.get('/current', guard, userController.current)
router.patch(
  '/sub',
  guard,
  validate.updateSubscription,
  userController.updateSubscription,
)

module.exports = router
