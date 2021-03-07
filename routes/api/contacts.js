const express = require('express')
const router = express.Router()

const contactsController = require('../../controllers/contacts')

router
  .get('/', contactsController.getAll)
  .post('/', contactsController.create)

router
  .get('/:contactId', contactsController.getById)
  .delete('/:contactId', contactsController.remove)
  .patch('/:contactId', contactsController.update)

module.exports = router
