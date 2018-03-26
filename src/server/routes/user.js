const express = require('express');
const router = express.Router();
const passportJWT = require('../auth/jwt');
const authHelpers = require('../auth/_helpers');

router.get('/', passportJWT.authenticate('jwt'), (req, res, next) => {
  let responseBody = {
    statusCode: 200,
    statusMessage: 'Get user success',
    data: {}
  };
  return res.status(responseBody.statusCode).json(responseBody);
});

module.exports = router;
