const knex = require("../db/connection.js")


function list(){
    return knex("tables")
        .select("*")
        .orderBy("table_name");
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