const knex = require("../db/connection.js")

function create(newRes){
    return knex("reservations")
        .insert(newRes,['reservation_id']);
};


module.exports = {
    create
}