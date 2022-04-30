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


async function create(req, res, next){
    const { table } = res.locals;
    table.seated = false; //come back and deal with this properly
    const data = await service.create(table)
    console.log(data)
    res.status(201).json({ data })
};



module.exports = {
    create:[validTableData,asyncErrorBoundary(create)]
}