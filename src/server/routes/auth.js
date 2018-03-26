const express = require('express');
const router = express.Router();
const authHelpers = require('../auth/_helpers');
const passportLocal = require('../auth/local');
const passportJWT = require('../auth/jwt');
const jwt = require('jsonwebtoken');

router.post('/register', authHelpers.loginRedirect, (req, res, next) => {
  return authHelpers.createUser(req, res)
    .then((response) => {
      passportLocal.authenticate('local', (error, user, info) => {
        if (user) {
          let payload = {
            id: user.id
          };
          let token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:'24h'});
          let responseBody = {
            statusCode: 200,
            statusMessage: 'Successfully registered user',
            data: {
              token: token,
              user:user
            }
          };
          return res.status(responseBody.statusCode).json(responseBody);
        }
      })(req, res, next);
    })
    .catch((error) => {
      let responseBody = {
        statusCode: 500,
        statusMessage: 'Error registering user',
        data: {}
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.post('/login', authHelpers.loginRedirect, (req, res, next) => {
  passportLocal.authenticate('local', (err, user, info) => {
    if (err) {
      let responseBody = {
        statusCode: 500,
        statusMessage: 'Error logging in user',
        data: {}
      };
      return res.status(responseBody.statusCode).json(responseBody);
    }
    if (!user) {
      let responseBody = {
        statusCode: 404,
        statusMessage: 'User not found',
        data: {}
      };
      return res.status(responseBody.statusCode).json(responseBody);
    }
    if (user) {
      req.logIn(user, function (err) {
        if (err) {
          let responseBody = {
            statusCode: 500,
            statusMessage: 'Error logging in user at request',
            data: {}
          };
          return res.status(responseBody.statusCode).json(responseBody);
        }
        let payload = {
          id: user.id
        };
        let token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:'24h'});
        let responseBody = {
          statusCode: 200,
          statusMessage: 'Successfully logged in user',
          data: {
            token: token,
            user:user
          }
        };
        return res.status(responseBody.statusCode).json(responseBody);
      });
    }
  })(req, res, next);
});

router.get('/logout', passportJWT.authenticate('jwt'), (req, res, next) => {
  req.logout();
  let responseBody = {
    statusCode: 200,
    statusMessage: 'Logout success',
    data: {}
  };
  return res.status(responseBody.statusCode).json(responseBody);
});

router.post('/forgot', (req, res, next) => {
  authHelpers.forgotPassword(req, res)
    .then((response) => {
      if (response) {
        let responseBody = {
          statusCode: 200,
          statusMessage: 'Successfully sent password reset for user',
          data: response
        };
        return res.status(responseBody.statusCode).json(responseBody);
      }
    })
    .catch((error) => {
      let responseBody = {
        statusCode: 500,
        statusMessage: 'Error reseting password for user',
        data: error
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.post('/reset', (req, res, next) => {
  return authHelpers.resetPassword(req, res)
    .then((response) => {
      if (response) {
        let responseBody = {
          statusCode: 200,
          statusMessage: 'Successfully changed password for user',
          data: response
        };
        return res.status(responseBody.statusCode).json(responseBody);
      }
    })
    .catch((error) => {
      let responseBody = {
        statusCode: 500,
        statusMessage: 'Error changed password for user',
        data:error
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

// *** helpers *** //

function handleLogin(req, user) {
  return new Promise((resolve, reject) => {
    req.login(user, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

module.exports = router;
