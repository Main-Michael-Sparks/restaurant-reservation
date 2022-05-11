const service = require("./tables.service.js")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js");

// Checks tables for the correct keys and properties. 
function validTableData(req, res, next) {

    const errorObj = {status: 400, message:"" };

    if(req.body.data){
        res.locals.table = req.body.data;
    } else {
        errorObj.message = "request body must include data key";
        return next(errorObj);
    };

    if(!res.locals.table.table_name){
        errorObj.message = "data must include table_name";
        return next(errorObj);
    };

    if(res.locals.table.table_name.length === 1) {
        errorObj.message = "table_name must have more than one character";
        return next(errorObj);
    };

    if(!res.locals.table.capacity){
        errorObj.message = "data must include a capacity greater than zero";
        return next(errorObj);
    };

    if(!(res.locals.table.capacity === Number(res.locals.table.capacity))){
        errorObj.message = "capacity must be a numer";
        return next(errorObj);
    };

    return next();
};

// Checks table "seat" for the correct keys and properties.
function validTableSeatData(req, res, next){

    if(req.body.data){
        res.locals.seatTable = req.body.data;
    } else {
        return next({
            status: 400,
            message: "request body must contain a data key"
        });
    };

    if(!res.locals.seatTable.reservation_id) {
        return next({
            status: 400,
            message: "reservation_id must be defined"
        });
    };
    return next();
};

// Checks table for a reservation assignment.  
async function validTableSeatReserId(req, res, next){
    const reservation = await service.read(res.locals.seatTable);
    if (!reservation) {
        return next({
            status: 404,
            message: `reservation_id: ${res.locals.seatTable.reservation_id} does not exist`
        });
    };
    res.locals.seatTable.table_id = req.params.table_id;
    return next();
}

// Checks table "seat" for capacity, reservation is seated or table is occupied. 
async function validTableSeat(req, res, next){
    //first union is tables, the second is reservations
    const resrTblChk = await service.read(res.locals.seatTable);
    res.locals.tblChk = {
        "table_id": res.locals.seatTable.table_id
    };
    
    const tblChk = await service.read(res.locals.tblChk);

    if(resrTblChk[0].capacity < resrTblChk[1].capacity){
        return next({
            status: 400,
            message: "table does not have enough capacity for reservation"
        });
    };

    //must be explicitly not null (not just truthy or falsy) reservation has a table assigned.
    if(resrTblChk[1].occupied !== null) {
        return next({
            status: 400,
            message: "reservation is currently seated and table is occupied"
        });
    };

    // checks if table is already assigned
    if(tblChk) {
        return next({
            status: 400,
            message: "table is currently occupied"
        });
    };
    return next();
}

// Checks table id to see if table exists. 
async function validTable(req, res, next){
    console.log("request:", req.baseUrl, req.body)
    res.locals.table_id = req.params.table_id;
    const table = await service.list(res.locals.table_id)
    console.log("BACKEND from validTable 1st Middleware in chain", table, res.locals.table_id)
    if(!table) {
        return next({
            status: 404,
            message: `table_id: ${res.locals.table_id} was not found`
        })
    };
    return next();
};

// Checks table for occupied.
async function isTblOcc(req, res, next){

    const isOccupied = await service.read(res.locals);
    console.log("Second middlware in DELETE chain", isOccupied)
    if(!isOccupied) {
        return next({
            status: 400,
            message: "Table is currently not occupied "
        });
    };
    return next()
};

async function update(req, res, next){
    const data = await service.update(res.locals.seatTable)
    res.status(200).json({ data });
}

async function list(req, res, next){
    const data = await service.list();
    res.json({ data })
};

async function create(req, res, next){
    const { table } = res.locals;
    const data = await service.create(table)
    res.status(201).json({ data })
};

async function distroy(req, res, next){
    const data = await service.destory(res.locals.table_id)
    console.log("Destroy function in Delete Chain", data)
    res.status(200).json({ data })
};

module.exports = {
    list,
    create:[validTableData,asyncErrorBoundary(create)],
    update:[validTableSeatData, asyncErrorBoundary(validTableSeatReserId), asyncErrorBoundary(validTableSeat), asyncErrorBoundary(update)],
    delete:[asyncErrorBoundary(validTable),asyncErrorBoundary(isTblOcc),asyncErrorBoundary(distroy)]
}