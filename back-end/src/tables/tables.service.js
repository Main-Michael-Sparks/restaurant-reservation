const knex = require("../db/connection.js")



function read(idPack){
    if (idPack.table_id) {
        return knex("tables")
            .select("capacity","table_id as occupied")
            .where({
                "table_id":idPack.table_id
            })
            .unionAll([
                knex("reservations")
                .select("people","table_id")
                .where({
                    "reservation_id": idPack.reservation_id
                })
            ]);
    }

    if(!idPack.table_id){
        return knex("reservations")
            .select("*")
            .where({"reservation_id": idPack.reservation_id})
            .first();
    };
}

function list(){
    return knex("tables")
        .leftJoin("reservations", "reservations.table_id", "tables.table_id")
        .select("tables.table_id","tables.table_name","tables.capacity", "reservations.reservation_id as occupied")
        .orderBy("tables.table_name");
};

function create(table) {
    return knex("tables")
        .insert(table, ['*'])
        .then(newTable => newTable[0]);
};

function update(idPack){
    return knex("reservations")
        .update({ "table_id" : idPack.table_id }, ["*"])
        .where({"reservation_id": idPack.reservation_id})
}


module.exports = {
    create,
    list,
    read,
    update
}