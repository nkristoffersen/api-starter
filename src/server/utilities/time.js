const moment = require('moment');

function currentTimestamp() {
  return moment().utc().toISOString();
}

module.exports = {
  currentTimestamp
};
