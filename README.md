# demo-feathers-auth0-api

API with authentication provided by Auth0, to be used by a single-page application.

## Step 0

Use `feathers-cli` to generate a REST API server skeleton

```
feathers generate
```

Linting

* Remove js-hint dependency
* Add `.eslintrc` with `standard` config
* Fix all files `eslint src/** --fix`

Launch the application: `npm start`

```
Feathers application started on localhost:3030
```

Check the routes:

* `http://localhost:3030/` will display the static page from the `public` folder
* `http://localhost:3030/user` will display a '401 Not Authorized' page.

## Step 1

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

You can also query the `users` service an HTTP request, passing the user's token in the `authorization`.
