'use strict'
const path = require('path')
const createAuthService = require('./auth0')
const user = require('./user')

const WEB_CLIENT_COOKIE = 'web-client-url'

module.exports = function () {
  const app = this

  // Middleware that adds a cookie with the URL where the request comes from,
  // reading the `source` querystring parameter.
  // Later, after a successful login, we will redirect the user to this URL.
  app.get('/auth/auth0', (req, res, next) => {
    const { source } = req.query
    if (source) {
      res.cookie(WEB_CLIENT_COOKIE, source)
    } else {
      res.clearCookie(WEB_CLIENT_COOKIE)
    }
    next()
  })

  app.get('/auth/success', function (req, res) {
    const url = req.cookies[WEB_CLIENT_COOKIE]
    if (url) {
      //  if there is a cookie that contains the URL source, redirect the user to this URL,
      // "forwarding" the short-term cookie that contains the user's token.
      const token = req.cookies['feathers-jwt']
      res.cookie('feathers-jwt', token, {
        maxAge: 1000 * 10 // will expire in 10 seconds
      })
      res.redirect(url)
    } else {
      // otherwise send the static page on the same domain.
      res.sendFile(path.resolve(process.cwd(), 'public', 'success.html'))
    }
  })

  app.configure(createAuthService())
  app.configure(user)
}
