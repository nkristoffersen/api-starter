exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').unique().notNullable().defaultTo(knex.raw('public.gen_random_uuid()')).primary();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.uuid('password_reset_token');
    table.timestamp('password_reset_expiration');
    table.timestamps(false, true);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
