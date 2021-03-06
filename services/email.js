const Mailgen = require('mailgen')
const sgMail = require('@sendgrid/mail')
const config = require('../config/email.json')
require('dotenv').config()

// const nodemailer = require('nodemailer')

const {
  SENDER,
  SENDER_PASSWORD
} = process.env

class EmailService {

  #sender = sgMail
  // #sender = nodemailer
#GenerateTemplate = Mailgen
    constructor(env) {
        switch (env) {
      case 'development':
        this.link = config.dev;
        break
      case 'stage':
        this.link = config.stage;
        break
      case 'production':
        this.link = config.prod;
        break
      default:
        this.link = config.dev;
        break
    }
     }
    #createTemplate(verifyToken, name = 'Guest') {
         const mailGenerator = new this.#GenerateTemplate({
      theme: 'cerberus',
      product: {
        name: 'Contacts',
        link: this.link,
      },
         })
        const template = {
      body: {
        name,
        intro: 'Welcome to Contacts',
        action: {
          instructions: 'If you want to register click here',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Please confirm your account',
            link: `${this.link}/api/users/verify/${verifyToken}`
          },
          outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
      }
    }
    return mailGenerator.generate(template)
     }

    async sendEmail(verifyToken, email, name) {
        const emailBody = this.#createTemplate(verifyToken, name)
        this.#sender.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
      to: email,
      from: `${process.env.SENDER}`,
      subject: 'Contacts: account verification',
      html: emailBody,
    };

    await this.#sender.send(msg);
  }
    }

//   async sendEmail(verifyToken, email, name) {
//     const emailBody = this.#createTemplate(verifyToken, name)

//     const transporter = this.#sender.createTransport({
//       host: 'smtp.meta.ua',
//       port: 465,
//       secure: true, // true for 465, false for other ports
//       auth: {
//         user: SENDER, // generated ethereal user
//         pass: SENDER_PASSWORD, // generated ethereal password
//       },
//     })

//     await transporter.sendMail({
//       from: SENDER, 
//       to: email, 
//       subject: 'Contacts: account verification', 
//       html: emailBody, 
//     })
//  }
// }
 



module.exports = EmailService
