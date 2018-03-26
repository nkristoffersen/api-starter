const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const authHelpers = require('../auth/_helpers');
const passportJWT = require('../auth/jwt');

router.post('/create',  passportJWT.authenticate('jwt'), (req, res, next) => {
  Item.createItem(req)
    .then((newItem) => {
      if (newItem) {
        let responseBody = {
          statusCode: 201,
          statusMessage: 'Item creation success',
          data: {
            item: newItem
          }
        };
        return res.status(responseBody.statusCode).json(responseBody);
      } else {
        let responseBody = {
          statusCode: 400,
          statusMessage: 'Something went wrong when creating a item',
          data: {}
        };
        return res.status(responseBody.statusCode).json(responseBody);
      }
    })
    .catch((error) => {
      let responseBody = {
        statusCode: 500,
        statusMessage: 'Item creation error',
        data: error
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.get('/',  passportJWT.authenticate('jwt'), (req, res, next) => {
  Item.getItemsOfUser(req)
    .then((items) => {
      let responseBody = {
        statusCode: 200,
        statusMessage: 'Get all items success',
        data: items
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch((error) => {
      let responseBody = {
        statusCode: 500,
        statusMessage: 'Get all items error',
        data: {}
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.get('/:id', passportJWT.authenticate('jwt'), (req, res, next) => {
  Item.getItemByID(req)
    .then((singleItem) => {
      if (!singleItem) {
        let responseBody = {
          statusCode: 404,
          statusMessage: 'Item not found',
          data: {}
        };
        return res.status(responseBody.statusCode).json(responseBody);
      } else {
        let responseBody = {
          statusCode: 200,
          statusMessage: 'Get item by id success',
          data: singleItem
        };
        return res.status(responseBody.statusCode).json(responseBody);
      }
    })
    .catch((error) => {
      let responseBody = {
        statusCode: 500,
        statusMessage: 'Get item by id error',
        data: {}
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.put('/:id', passportJWT.authenticate('jwt'), (req, res, next) => {
  Item.updateItemByID(req)
    .then((updatedItem) => {
      if (updatedItem === 0 || !updatedItem) {
        let responseBody = {
          statusCode: 404,
          statusMessage: 'Item not found',
          data: {
            updatedCount: updatedItem
          }
        };
        return res.status(responseBody.statusCode).json(responseBody);
      } else if (updatedItem === 1) {
        let responseBody = {
          statusCode: 200,
          statusMessage: 'Update item by id success',
          data: {
            updatedCount: updatedItem
          }
        };
        return res.status(responseBody.statusCode).json(responseBody);
      }
    })
    .catch((error) => {
      let responseBody = {
        statusCode: 500,
        statusMessage: 'Update item by id error',
        data: {}
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.delete('/:id',  passportJWT.authenticate('jwt'), (req, res, next) => {
  Item.deleteItemByID(req)
    .then((updatedItem) => {
      if (updatedItem === 0 || !updatedItem) {
        let responseBody = {
          statusCode: 404,
          statusMessage: 'Item not found',
          data: {
            updatedCount: updatedItem
          }
        };
        return res.status(responseBody.statusCode).json(responseBody);
      } else if (updatedItem === 1) {
        let responseBody = {
          statusCode: 200,
          statusMessage: 'Delete item by id success',
          data: {}
        };
        return res.status(responseBody.statusCode).json(responseBody);
      }
    })
    .catch((error) => {
      let responseBody = {
        statusCode: 500,
        statusMessage: 'Delete item by id error',
        data: {}
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

module.exports = router;
