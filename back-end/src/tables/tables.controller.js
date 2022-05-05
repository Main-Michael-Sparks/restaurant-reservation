const service = require("./tables.service.js")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js");

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

    if(isNaN(res.locals.table.capacity)){
        errorObj.message = "capacity must be a numer";
        return next(errorObj);
    };

    return next();
};

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

async function validTableSeat(req, res, next){
    //first union is tables, the second is reservations
    const resrTblChk = await service.read(res.locals.seatTable)
    if(resrTblChk[0].table_capacity < resrTblChk[1].table_capacity){
        return next({
            status: 400,
            message: "table does not have enough capacity for reservation"
        });
    };

    //must be explicitly not null (not just truthy or falsy)
    if(resrTblChk[1].occupied !== null) {
        return next({
            status: 400,
            message: "table is currently occupied"
        });
    };
    return next();
}

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
    console.log(data)
    res.status(201).json({ data })
};

module.exports = {
    list,
    create:[validTableData,asyncErrorBoundary(create)],
    update:[validTableSeatData, asyncErrorBoundary(validTableSeatReserId), asyncErrorBoundary(validTableSeat), asyncErrorBoundary(update)]
}