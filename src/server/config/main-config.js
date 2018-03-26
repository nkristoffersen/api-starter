(function (appConfig) {

  'use strict';

  require('dotenv').config({silent: true});

  // *** main dependencies *** //
  const path = require('path');
  const knex = require('../db/connection');
  const bodyParser = require('body-parser');
  const flash = require('connect-flash');
  const morgan = require('morgan');
  const passport = require('passport');
  const helmet = require('helmet');
  const cors = require('cors');

  appConfig.init = function (app, express) {
    if (process.env.NODE_ENV !== 'test') {
      app.use(morgan('short'));
    }

    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(passport.initialize());
    app.use(flash());
  };

})(module.exports);
