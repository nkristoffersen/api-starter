exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(() => {
      return Promise.join(
        // Inserts seed entries
        knex('items').insert({
          id: 'a7754607-923e-403f-8998-c5d310fa29fb',
          name: 'The First Item',
          deleted:false
        })
      );
    })
    .then(() => {
      return Promise.join(
        // Inserts seed entries
        knex('items').insert({
          id: '89fc7eef-4d0e-4f9c-9fb9-0d45092ee887',
          name: 'Second Item',
          deleted:false
        })
      );
    });
};
