// Add a status column to the reservations table.
exports.up = function(knex) {
    return knex.schema.table("reservations", (table)=>{
        table.string("status")
            .defaultTo("booked");
    });
};

// Delete the status column on roll back. 
exports.down = function(knex) {
    return knex.schema.table("reservations", (table)=>{
        table.dropColumn("status");
    });
};
