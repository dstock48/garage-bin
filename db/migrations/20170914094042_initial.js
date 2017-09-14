exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('garage', (table) => {
      table.increments('id').primary();
      table.string('item_name');
      table.string('reason');
      table.string('cleanliness');
      table.timestamps(true, true);
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('garage')
  ]);
};
