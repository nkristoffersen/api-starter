const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) => {
  return knex('users').del()
    .then(() => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('johnson123', salt);
      return Promise.join(
        knex('users').insert({
          // id: 6,
          id: 'd944da5f-36e5-4c6d-a4ed-a6e4f0d5980f',
          email: 'jeremy@example.com',
          password: hash
        })
      );
    })
    .then(() => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('bryant123', salt);
      return Promise.join(
        knex('users').insert({
          // id: 7,
          id: 'f3d402b1-6109-4ae5-9fc8-40c7459bb84d',
          email: 'kelly@example.com',
          password: hash
        })
      );
    });
};
