const authentication = require('feathers-authentication')
const Auth0Strategy = require('passport-auth0').Strategy

function createService (userEndpoint = '/users') {
  return authentication({
    idField: '_id',
    shouldSetupSuccessRoute: false, // if true, Feathers will generate its own `auth/success` route
    // userEndpoint,
    auth0: {
      strategy: Auth0Strategy,
      domain: process.env.AUTH0_DOMAIN,
      'clientID': process.env.AUTH0_ID,
      'clientSecret': process.env.AUTH0_SECRET
    },
    token: {
      secret: process.env.TOKEN_SECRET
    }
  })
}

module.exports = createService
