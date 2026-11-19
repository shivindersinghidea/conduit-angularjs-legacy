# ![Angular 1.5+ ES6 & Component API Example App](project-logo.png)

> Example Angular 1.5+ (ES6 + Components) codebase that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) spec and API.

View the **[demo application](https://angularjs.realworld.io)** or **[learn how to build the application from scratch](https://thinkster.io/angularjs-es6-tutorial)**!

# Getting started

1. Clone repo
2. `npm install`
3. `gulp`

Make sure you have gulp installed globally (`npm install -g gulp`)

### Making requests to the backend API

For convenience, we have a live API server running at https://conduit.productionready.io/api for the application to make requests against. You can view [the API spec here](https://github.com/GoThinkster/productionready/blob/master/api) which contains all routes & responses for the server.

The source code for the backend server (available for Node, Rails and Django) can be found in the [main RealWorld repo](https://github.com/gothinkster/realworld).

If you want to change the API URL to a local server, simply edit `src/js/config/app.constants.js` and change `api` to the local server's URL (i.e. `localhost:3000/api`)

<br />

[![Brought to you by Thinkster](https://raw.githubusercontent.com/gothinkster/realworld/master/media/end.png)](https://thinkster.io)

## Characterisation tests (DLV-EDZJKU)

This repository now includes Cypress end-to-end characterisation tests that pin the behaviour of the legacy AngularJS "first slice" (article list and article view) to support the React strangler migration (DLV-EDZJKU).

To run the tests locally:

1. npm install --no-audit --no-fund --no-package-lock
2. npm run test:serve
3. npm run test:e2e

The tests are fixture-driven and intercept API calls to make CI deterministic. Fixtures live under cypress/fixtures and the main spec is cypress/e2e/characterisation.spec.js.

If you want the tests to run against a live backend, adjust the cypress intercepts or run the server without stubbing (not recommended for CI).