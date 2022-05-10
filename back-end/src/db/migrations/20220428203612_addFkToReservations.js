// Add a foreign key constraint to the reservations table to create a many-one relations with tables table.
exports.up = function(knex) {
    return knex.schema.table("reservations", (table)=>{
        table.integer("table_id")
            .unsigned();
        table.foreign("table_id")
            .references("table_id")
            .inTable("tables")
            .onDelete("CASCADE");
    });
};

// Delete the foreign key column on roll back. 
exports.down = function(knex) {
  return knex.schema.table("reservations", (table)=>{
      table.dropColumn("table_id");
  });
};
