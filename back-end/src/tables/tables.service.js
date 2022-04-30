const knex = require("../db/connection.js")

function create(table) {
    return knex("tables")
        .insert(table, ['*'])
        .then(newTable => newTable[0]);
};


module.exports = {
    create
}