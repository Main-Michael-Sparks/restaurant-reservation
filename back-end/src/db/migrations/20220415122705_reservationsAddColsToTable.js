
// add cols to the default table migration script
exports.up = function(knex) {
  return knex.schema.table("reservations",(table)=>{
        table.string("first_name")
            .notNullable();
        table.string("last_name")
            .notNullable();
        table.string("mobile_number")
            .notNullable();
        table.string("reservation_time")
            .notNullable();
        table.string("reservation_date")
            .notNullable();
        table.integer("people")
            .unsigned()
            .notNullable();
  });
};

// remove the cols added to the deault table migration script
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
