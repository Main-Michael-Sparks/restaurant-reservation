// Create reservations table and set up primary key.
exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary();
    table.timestamps(true, true);
  });
};

// Drop reservations table on roll back. 
exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};
