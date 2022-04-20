const knex = require("../db/connection.js")

const resTable = "reservations"

function create(newRes){
    return knex(resTable)
        .insert(newRes,['reservation_date']);
};

function read( reservation_date ) {
    return knex(resTable)
        .select("*")
        .where({ reservation_date })
        .orderBy('reservation_time');

}


module.exports = {
    create,
    read
}