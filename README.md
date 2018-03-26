## LOCAL SETUP
1. `$ npm install`
1. Add a *.env* file
1. Look at *.env-example* for how to setup *.env* file
1. Create two local Postgres databases - `api-starter_db_dev` and `api-starter_db_test`
1. Migrate - `knex migrate:latest --env development`
1. Seed - `knex seed:run --env development`

## DEVELOPMENT
1. Create new file for new route group in `./src/server/routes/`
1. Create new file for new models and database access for the route group in `./src/server/models/`
1. Update `./src/server/config/route-config.js` to include the new route group
1. `$ npm run dev`

## TESTING
1. Create new files for migration tables
1. Create new files for seed content
1. Create new file for tests in `./test/integration/` follow the file name structure of existing tests
1. Write tests for every endpoint case. Success, failure, unauthorized, unauthenticated, bad request
1. If endpoint uses 3rd party endpoint, mock the endpoint in order to allow testing when offline
1. `$ npm test`

## DEPLOYMENT
1. commit to master branch and gitlab will run all tests and then deploy to the cloud

## NOTES
1. generating uuid for seeds: `uuidgen | tr "[:upper:]" "[:lower:]"`
1. DEBUG=express:*
