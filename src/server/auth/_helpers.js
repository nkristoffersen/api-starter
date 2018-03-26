const bcrypt = require('bcryptjs');
const knex = require('../db/connection');
const email = require('./email.js');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createToken() {
  return uuidv4();
}

function isValidUUID(token) {
  let uuid = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  return uuid.test(token);
}

function createExpiration() {
  return moment().add(24, 'hours').toISOString();
}

function createUser(req, res) {
  return handleErrors(req)
    .then(() => {
      let salt = bcrypt.genSaltSync();
      let hash = bcrypt.hashSync(req.body.password, salt);
      return knex('users')
        .insert({
          email: req.body.email,
          password: hash
        })
        .returning('*');
    })
    .catch((err) => {
      if (err.code && err.code === '23505') {
        err.message = 'User already exists';
      }
      let responseBody = {
        statusCode: 400,
        statusMessage: err.message,
        data: {}
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
}

function loginRequired(req, res, next) {
  if (!req.user) {
    let responseBody = {
      statusCode: 401,
      statusMessage: 'Please log in',
      data: {}
    };
    return res.status(responseBody.statusCode).json(responseBody);
  }
  return next();
}

function adminRequired(req, res, next) {
  if (!req.user) {
    let responseBody = {
      statusCode: 401,
      statusMessage: 'Please log in',
      data: {}
    };
    res.status(responseBody.statusCode).json(responseBody);
  }
  return knex('users').where({
      email: req.user.email
    }).first()
    .then((user) => {
      if (!user.admin) {
        let responseBody = {
          statusCode: 401,
          statusMessage: 'You are not authorized',
          data: {}
        };
        res.status(responseBody.statusCode).json(responseBody);
      }
      return next();
    })
    .catch((err) => {
      let responseBody = {
        statusCode: 500,
        statusMessage: 'Something bad happened',
        data: {}
      };
      res.status(responseBody.statusCode).json(responseBody);
    });
}

function forgotPassword(req, res, next) {
  return new Promise((resolve, reject) => {
    if (!req.body.email) {
      reject({
        message: 'Please provide email'
      });
    } else if (req.body.email) {
      let userPasswordResetUpdate = {
        password_reset_token: createToken(),
        password_reset_expiration:createExpiration(),
        updated_at:moment().utc().toISOString()
      };
      knex('users')
      .where({email: req.body.email})
      .first()
      .then((foundUser) => {
        if (!foundUser || !foundUser.id) {
          reject({message:'Could not find user with this email'});
          return;
        }
        knex('users')
        .where({id:foundUser.id})
        .update(userPasswordResetUpdate)
        .returning('*')
        .then((updatedUser) => {
          if (updatedUser[0]) {
            let resetEmailContent = {
              email:updatedUser[0].email,
              link:'http://localdev.barleyboard.com:3000/reset/' + updatedUser[0].password_reset_token
            };
            email(resetEmailContent)
            .then((message) => {
              resolve({message:`Emailed user at ${req.body.email}`});
            })
            .catch((error) => {
              reject({message:error});
            });
          }
        });
      });
    } else {
      reject({message:'Something went wrong when sending reset password email'});
    }
  });
}

function resetPassword(req, res, next) {
  return new Promise((resolve, reject) => {
    if (!req.body.token || isValidUUID(req.body.token) === false) {
      reject({
        message: 'Please provide valid token'
      });
    } else if (req.body.password.length < 8) {
      reject({
        message: 'Password must be longer than 8 characters for security'
      });
    } else if (req.body.password.length > 8 && req.body.token) {
      let salt = bcrypt.genSaltSync();
      let hash = bcrypt.hashSync(req.body.password, salt);
      let now = moment().utc().toISOString();
      let userPasswordChangeUpdate = {
        password:hash,
        updated_at:now,
        password_reset_expiration:now
      };
      return knex('users')
      .where({password_reset_token: req.body.token})
      .first()
      .then((foundUser) => {
        if (foundUser && moment(foundUser.password_reset_expiration).isAfter()) {
          knex('users')
          .where({id:foundUser.id})
          .update(userPasswordChangeUpdate)
          .returning('*')
          .then((updatedUser) => {
            if (updatedUser) {
              resolve({message:'Updated password for user. Log in with new password now.'});
            }
          });
        } else {
          reject({message:'User not found or token has expired'});
        }
      });
    } else {
      reject({message:'Something went wrong when reseting password'});
    }
  });
}

function loginRedirect(req, res, next) {
  if (req.user) {
    let responseBody = {
      statusCode: 401,
      statusMessage: 'You are already logged in',
      data: {}
    };
    return res.status(responseBody.statusCode).json(responseBody);
  }
  return next();
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function handleErrors(req) {
  return new Promise((resolve, reject) => {
    if (req.body.password.length < 8) {
      reject({
        message: 'Password must be longer than 8 characters'
      });
    } else if (!validateEmail(req.body.email)) {
      reject({
        message: 'Email is not valid'
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  comparePass,
  createUser,
  loginRequired,
  adminRequired,
  loginRedirect,
  forgotPassword,
  resetPassword
};
