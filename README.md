# demo-feathers-auth0-api

A basic example of API with authentication provided by Auth0, to be used by a single-page application.

This is my attemps to solve [this question](http://stackoverflow.com/questions/40497554/auth0-authentication-of-single-page-app-on-a-different-domain-than-the-api):

How to use an API with authentication, using 2 different domains, one for the API, one for the web client (Single-Page application) ?

## Step 0: creating an application with FeathersJS

Use `feathers-cli` to generate a REST API server skeleton

```
feathers generate
```

Linting

* Remove js-hint dependency
* Add `.eslintrc` with `standard` config
* Fix all files `eslint src/** --fix`

Launch the application: `npm start`

The following message should be displayed:

```
Feathers application started on localhost:3030
```

Check the routes from the browser:

* `http://localhost:3030/` will display the static page from the `public` folder
* `http://localhost:3030/user` will display a '401 Not Authorized' page.


## Step 1: adding Auth0

### Setup

Add authentication with Auth0 feature following this example: https://github.com/feathersjs/feathers-demos/tree/master/examples/authentication/auth0

* Create a new service called `auth0`
* Add a `public/success.html` page, to be displayed after a successful login
* Set up `/auth/success` route
* Add `feathers client` javascript code in the `public.html` to be able authenticate the user and query the REST services

Add `dotenv` package to read credentials from `.env` files

Add `.env` file at the root level

```
AUTH0_DOMAIN=******.auth0.com
AUTH0_SECRET=****************************************************************
AUTH0_ID=********************************
TOKEN_SECRET=******
```

### Checking the Authentication flow

Go to `http://localhost:3030/auth/auth0`

After the authentication, you will be redirected to `http://localhost:3030/auth/success`

The user token will be displayed in the console.

The Feathers client can be used to retrieved information about the user:

* `app.get('user')` returns the current user
* `app.get('token')` returns the user's token (around 180 characters)

And now you can query the `users` service.

Example:

```js
app.service('users').find()
  .then(r => console.log(r))
```

It will return the user list:

```json
{
  "total": 1,
  "limit": 5,
  "skip": 0,
  "data": [
    {
      "auth0Id": "google-oauth2|<user_id>",
      "auth0": {
        "email": "user@worldcompany.com",
        "email_verified": true,
        "name": "Michael Rambeau",
        "given_name": "Michael",
        "family_name": "Rambeau",
        "picture": "https://lh5.googleusercontent.com/-FJVKv6lUo38/AAAAAAAAAAI/AAAAAAAAAAk/KOeF-rvKgnM/photo.jpg",
        "locale": "en",
        "clientID": "<client_id>",
        "updated_at": "2016-11-13T01:34:58.608Z",
        "user_id": "google-oauth2|<user_id>",
        "nickname": "michael",
        "identities": [
          {
            "provider": "google-oauth2",
            "user_id": "<user_id>",
            "connection": "google-oauth2",
            "isSocial": true
          }
        ],
        "created_at": "2016-10-22T01:24:36.617Z",
        "sub": "google-oauth2|<user_id>",
        "accessToken": "<16char_long_token>"
      },
      "_id": "<database_id>"
    }
  ]
}
```

You can also query the `users` service using an HTTP request, passing the user's token in the `authorization` header.

## Step 2: authentication from an other domain

Now we want to be able to login from a single-page hosted on an other domain.

So we are going to create a html page hosted on `http://localhost:3000` for example.

In the previous step, after a successful authentication happens, the `/auth/success` route route was called, and the server redirected to a static html page, sending a `feathers-jwt` cookie that contains the user's token.
Then, on the client side, the Feathers client reads the token stored in the cookie and stores it in the browser local storage.

In the single-page app scenario, after a successful authentication, instead of redirecting the user to the static page, we have to redirect the user back to the single-page application.

We can do that by adding adding a `source` parameter to the authentication URL, in the SPA "LOGIN" button.

```html
<a href="http://localhost:3030/auth/auth0?source=http://localhost:3000" class="button">LOGIN</a>
```

Then, server-side, we create a middleware that reads this parameters and stores it inside a cookie.

```js
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
```

Finally, after a successful login, we read the cookie that contains the source URL and we also have to send the `feathers-jwt` cookie to the single-page application.

```js
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
```
