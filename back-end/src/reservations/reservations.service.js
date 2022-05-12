const knex = require("../db/connection.js")

const resTable = "reservations"

//SQL query to add a new reservation into the reservation table. 
function create(newRes){
    return knex(resTable)
        .insert(newRes,['*'])
        .then(returnRes=>returnRes[0]);
};

//SQL queries to "search" for reservations by date, reservation Id or phone number.
function read( search, searchFor="" ) {

    if(searchFor === "date") {
        console.log("search for date", search)
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

//SQL queries to update reservations or reservations status. 
function update(reservation_id, data, updateType=""){

    if(updateType === "status") {
        return knex("reservations")
            .update({"status": data}, ["*"])
            .where({"reservation_id": reservation_id})
            .then(res => res[0])
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