
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

exports.down = function(knex) {
  return knex.schema.table("reservations", (table)=>{
      table.dropColumn("table_id");
  });
};
