const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for your contact'],
      unique: true,
      minlength: 2,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, 'Set email for your contact'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Set phone number for your contact'],
      unique: true,
    },
    subscription: {
      type: String,
      default: 'free',
    },
    password: {
      type: String,
      default: 'password',
    },
    token: {
      type: String,
      default: '',
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },

  { versionKey: false, timestamps: true }
)

const Contact = model('contact', contactSchema)

module.exports = Contact
