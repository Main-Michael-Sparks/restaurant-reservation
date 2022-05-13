// Add columns to the reservations table. 
exports.up = function(knex) {
  return knex.schema.table("reservations",(table)=>{
        table.string("first_name")
            .notNullable();
        table.string("last_name")
            .notNullable();
        table.string("mobile_number", 14)
            .notNullable();
        table.time("reservation_time")
            .notNullable();
        table.date("reservation_date")
            .notNullable();
        table.integer("people")
            .unsigned()
            .notNullable();
  });
};

// Remove columns from the reservations table on roll back.
exports.down = function(knex) {
    return knex.schema.table("reservations", (table)=>{
        table.dropColumn("first_name");
        table.dropColumn("last_name");
        table.dropColumn("mobile_number");
        table.dropColumn("reservation_time");
        table.dropColumn("reservation_date");
        table.dropColumn("people");
    });
};
