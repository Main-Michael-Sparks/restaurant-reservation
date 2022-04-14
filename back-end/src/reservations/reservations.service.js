const knex = require("../db/connection.js")

function create(newRes){
    return knex("reservations")
        .insert(newRes)
        .returning("*");
};


module.exports = {
    create
}