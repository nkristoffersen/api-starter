require('dotenv').config({silent: true});
module.exports = {
  development: {
    client: 'postgresql',
    debug: process.env.DB_DEBUG || false,
    connection: 'postgres://' + process.env.DEV_POSTGRES_USER + '@' + process.env.DEV_POSTGRES_HOST + ':5432/' + process.env.DEV_POSTGRES_DB,
    pool: {
      afterCreate: function (conn, done) {
        // in this example we use pg driver's connection API
        conn.query('SET timezone="UTC";', function (err) {
          if (err) {
            // first query failed, return error and don't try to make next query
            done(err, conn);
          } else {
            // do the second query...
            conn.query('create extension if not exists "pgcrypto";', function (err) {
              // if err is not falsy, connection is discarded from pool
              // if connection aquire was triggered by a query the error is passed to query promise
              done(err, conn);
            });
          }
        });
      }
    },
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds'
    }
  },
  test: {
    client: 'postgresql',
    debug:  process.env.DB_DEBUG || false,
    connection: 'postgres://postgres@localhost:5432/jobhero_db_test',
    pool: {
      afterCreate: function (conn, done) {
        // in this example we use pg driver's connection API
        conn.query('SET timezone="UTC";', function (err) {
          if (err) {
            // first query failed, return error and don't try to make next query
            done(err, conn);
          } else {
            // do the second query...
            conn.query('create extension if not exists "pgcrypto";', function (err) {
              // if err is not falsy, connection is discarded from pool
              // if connection aquire was triggered by a query the error is passed to query promise
              done(err, conn);
            });
          }
        });
      }
    },
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds'
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    debug: process.env.DB_DEBUG || false,
    pool: {
      min: 2,
      max: 150,
      afterCreate: function (conn, done) {
        // in this example we use pg driver's connection API
        conn.query('SET timezone="UTC";', function (err) {
          if (err) {
            // first query failed, return error and don't try to make next query
            done(err, conn);
          } else {
            // do the second query...
            conn.query('create extension if not exists "pgcrypto";', function (err) {
              // if err is not falsy, connection is discarded from pool
              // if connection aquire was triggered by a query the error is passed to query promise
              done(err, conn);
            });
          }
        });
      }
    },
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds'
    }
  }
};
