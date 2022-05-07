const knex = require("../db/connection.js")

const resTable = "reservations"

function create(newRes){
    return knex(resTable)
        .insert(newRes,['*'])
        .then(returnRes=>returnRes[0]);
};

function read( search, searchFor="" ) {

    if(searchFor === "date") {
        return knex(resTable)
            .select("*")
            .where({ "reservation_date": search })
            .andWhereNot({"status": "finished"})
            .orderBy('reservation_time');
    };

    if(searchFor === "reservationId"){
        return knex(resTable)
            .select("*")
            .where({ "reservation_id": search })
            .first();
    };

    if(searchFor === "mobile") {
        return knex(resTable)
        .where('mobile_number', 'ilike', `%${search}%`)
    }
    
};

function update(reservation_id,status){
    console.log("update executed")
    return knex("reservations")
        .update({"status": status}, ["*"])
        .where({"reservation_id": reservation_id})
}


module.exports = {
    create,
    read,
    update
}