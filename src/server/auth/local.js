const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const init = require('./passport');
const knex = require('../db/connection');
const authHelpers = require('./_helpers');

const options = {
  session: false,
  usernameField: 'email',
  passwordField: 'password'
};

init();

passport.use(new LocalStrategy(options, (email, password, done) => {
  knex.select('*')
  .from('users')
  .where({
    'users.email':email
  }).first()
    .then((user) => {
      if (!user) return done(null, false);
      if (!authHelpers.comparePass(password, user.password)) {
        return done(null, false);
      } else {
        delete user.password;
        return done(null, user);
      }
      return;
    })
    .catch((err) => {
      return done(err);
    });
}));

module.exports = passport;
