const knex = require("../db/connection.js")

// SQL queries for reservations on foreign key, reservation id or reservations with tables (unionALL)
function read(idPack){
    console.log("from read function:", idPack)
    if (idPack.table_id && idPack.reservation_id) {
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
    
    if(!idPack.reservation_id){
        return knex("reservations")
            .select("*")
            .where({"table_id": idPack.table_id})
            .first();
    };
};

// SQL queries for tables by Id or joined with reservations on foreign key. (list tables and tables with reservations assigned)
function list(table_id, doubleCheck=null){
    // jest fix: 
    if(doubleCheck){
        console.log("From Double Check", table_id)
        return knex("tables")
            .select("*")
            .where('table_name', 'ilike', `%${table_id}`)
            .first();
    }

    console.log("From List tableID", table_id)
    if(table_id){
        return knex("tables")
            .select("*")
            .where({ table_id })
            .first();
    };

    return knex("tables")
        .leftJoin("reservations", "reservations.table_id", "tables.table_id")
        .select("tables.table_id","tables.table_name","tables.capacity", "reservations.reservation_id as occupied")
        .orderBy("tables.table_name");
};

// SQL query to assign a foreign key to reservations "seating it" to a table.
function update(idPack){
    return knex("reservations")
        .update({ "table_id" : idPack.table_id,
                "status":"seated"
        }, ["*"])
        .where({"reservation_id": idPack.reservation_id});
};

//SQL query to create a new table, 'jest test' query added for compatibility. 
function create(table) {

    //if statement added for frontend jest test #5 API call
    if(table.reservation_id){
        const newTable = {
            table_name:table.table_name,
            capacity:table.capacity
        }
       return knex("tables")
        .insert(newTable,["*"])
        .then((resTbl)=>{
            const idPack = {
                "table_id": resTbl[0].table_id,
                "reservation_id": table.reservation_id
            }
            resTbl[1] = idPack;
           return resTbl
        })
        .then(resTbl => {
            return update(resTbl[1]).then(()=>resTbl[0]);
        });
    };

    return knex("tables")
        .insert(table, ['*'])
        .then(newTable => newTable[0]);
};

// SQL query to remove a seating assignment from a table. (query reservations to remove key, and update status)
function destory(table_id) {
   return knex("reservations")
    .update({ "table_id": null,
            "status": "finished"
    },["*"])
    .where({ table_id });
};

module.exports = {
    create,
    list,
    read,
    update,
    destory
};