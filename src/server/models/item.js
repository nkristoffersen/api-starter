const knex = require('../db/connection');
const Time = require('../utilities/time');
const uuidv4 = require('uuid/v4');

function createItem(req) {
  let itemData = {
    name: req.body.name,
    deleted:false
  };
  return knex('items').insert(itemData).returning('*');
}

function getItemByID(req) {
  return knex.select('items.*')
    .from('items')
    .where({
      'items.id': req.params.id,
      'items.deleted': false
    })
    .first();
}

function deleteItemByID(req) {
  var deleteBody = {
    updated_at: Time.currentTimestamp(),
    deleted: true
  };
  return knex('items').select('*').where({
    id: req.params.id
  }).update(deleteBody);
}

function updateItemByID(req) {
  var updateBody = {
    updated_at: Time.currentTimestamp(),
    name:req.body.name
  };
  return knex('items').select('*').where({
    id: req.params.id
  }).update(updateBody);
}

function getItemsOfUser(req) {
  return knex.select('items.*')
    .from('items')
    .where({
      'items.deleted': false
    });
}

module.exports = {
  createItem,
  getItemByID,
  deleteItemByID,
  updateItemByID,
  getItemsOfUser
};
