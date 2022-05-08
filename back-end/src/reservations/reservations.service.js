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

function update(reservation_id, data, updateType=""){

    if(updateType === "status") {
        return knex("reservations")
            .update({"status": data}, ["*"])
            .where({"reservation_id": reservation_id})
            .then(res =>res[0])
    }

    if(updateType === "reservation"){
        return knex("reservations")
            .update(data,["*"])
            .where({"reservation_id": reservation_id})
            .then(res => res[0])
    }
}


module.exports = {
    create,
    read,
    update
}