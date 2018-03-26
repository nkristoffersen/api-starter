exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('items', function (table) {
      table.uuid('id').unique().notNullable().defaultTo(knex.raw('public.gen_random_uuid()')).primary();
      table.string('name').notNullable();
      table.boolean('deleted').notNullable().defaultTo(false);
      table.timestamps(false, true);
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('items')
  ]);
};
