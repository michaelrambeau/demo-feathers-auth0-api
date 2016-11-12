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
