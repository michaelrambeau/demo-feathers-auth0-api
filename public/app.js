function authenticate() {
  const host = 'http://localhost:3030'
  // Set up Feathers client side
  const app = feathers()
    .configure(feathers.rest(host).fetch(window.fetch))
    .configure(feathers.hooks())
    .configure(feathers.authentication({ storage: window.localStorage }))

  // authenticate using your JWT that was passed in the short lived cookie
  app.authenticate()
    .then(function (result){
      console.info('Authenticated!', result)
      console.log('Your JWT is: ' + app.get('token'))
    })
    .catch(function (error){
      console.error('Error authenticating!', error)
    })

  window.app = app
}
