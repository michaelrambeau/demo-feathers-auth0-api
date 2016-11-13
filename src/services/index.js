'use strict'
const path = require('path')
const createAuthService = require('./auth0')
const user = require('./user')

module.exports = function () {
  const app = this

  // Set up our own custom redirect route for successful login
  app.get('/auth/success', function (req, res) {
    res.sendFile(path.resolve(process.cwd(), 'public', 'success.html'))
  })

  app.configure(createAuthService())
  app.configure(user)
}
