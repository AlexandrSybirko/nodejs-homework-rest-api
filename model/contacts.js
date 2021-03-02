const fs = require('fs/promises')
const path = require('path')
const { v4: uuid } = require('uuid')

const contactsPath = path.join(__dirname, '../model/contacts.json')

const listContacts = async () => {
  const list = await fs.readFile(contactsPath, 'utf8')
  return JSON.parse(list)
}

const getContactById = async (contactId) => {
  const contacts = await listContacts()
  const contact = contacts.find(({ id }) => id.toString() === contactId)
  return contact
}

const removeContact = async (contactId) => {
  const contacts = await listContacts()
  const contactsUpdate = contacts.filter(({ id }) => id.toString() !== contactId)
  await fs.writeFile(contactsPath, JSON.stringify(contactsUpdate, null, 2), 'utf-8')
  return contactsUpdate
}

const addContact = async (body) => {
  const contacts = await listContacts()
  const newContact = { id: uuid(), ...body }
  const newContacts = [...contacts, newContact]
  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2), 'utf8')
  return newContact
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts()
  const contact = contacts.find(({ id }) => id.toString() === contactId)
  const newContact = { ...contact, ...body }
  const newListContacts = contacts.map((obj) =>
    String(obj.id) === contactId ? newContact : obj
  )
  await fs.writeFile(
    contactsPath,
    JSON.stringify(newListContacts, null, 2),
    'utf8'
  )
  return newContact
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
