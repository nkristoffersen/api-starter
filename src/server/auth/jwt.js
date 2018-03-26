const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const init = require('./passport');
const knex = require('../db/connection');
const authHelpers = require('./_helpers');

const options = {
  jwtFromRequest: ExtractJwt.fromHeader('auth_token'),
  secretOrKey: process.env.JWT_SECRET,
  session:false
};
init();
passport.use(new JwtStrategy(options, function (jwt_payload, done) {
  var id = jwt_payload.id;
  knex('users').where({
      id
    }).first()
    .then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch((err) => {
      return done(err);
    });
}));

module.exports = passport;
