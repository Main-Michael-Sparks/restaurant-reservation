const knex = require("../db/connection.js")


function list(){
    return knex("tables")
        .leftJoin("reservations", "reservations.table_id", "tables.table_id")
        .select("tables.table_id","tables.table_name","tables.capacity", "reservations.reservation_id as occupied")
        .orderBy("tables.table_name");
}

function create(table) {
    return knex("tables")
        .insert(table, ['*'])
        .then(newTable => newTable[0]);
};


module.exports = {
    create,
    list
}