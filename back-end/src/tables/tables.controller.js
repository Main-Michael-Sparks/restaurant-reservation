const service = require("./reservations.service.js")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js");

function _isValid(check, outcome=true, message=""){

    errors = { status: 400, message: message }

    if(outcome){
        if(check){
            return next(errors);
        }
    };

    if(outcome === false) {
        if(!check) {
            return next(errors)
        } 
    };

    return {}
};


function validTableData(req, res, next) {

    const errorObj = {status: 400, message:"" }

    if(req.body.data){
        res.locals.table = req.body.data
    } else {
        errorObj.message = "request body must include data key"
        return next(errorObj);
    };
    // testing helper functions on large blocks of validation
    _isValid(res.locals.table.table_name,false,"data must include table_name");
    _isValid(res.locals.table.capacity,false,"data must include capacity");
    _isValid(res.locals.table.capacity,false,"data must include capacity");
    _isValid(isNaN(res.locals.capacity),true,"capacity must be a number");
    _isValid(res.locals.capacity <= 0 ,true,"capacity must be greater than zero");
/*
    if(!res.locals.table.table_name){
        errorObj.message = "data must include table_name"
        return next(errorObj);
    };

    if(!res.locals.table.capacity){
        errorObj.message = "data must include capacity"
        return next(errorObj);
    };

    if(isNaN(res.locals.capacity)){
        errorObj.message = "capacity must be a numer"
        return next(errorObj);
    };

    if(res.locals.capacity <= 0 ){
        errorObj.message = "capacity must be greater than zero"
        return next(errorObj);
        return next({ status: 400, message: "capacity must be greater than zero" });
    };
    */

    return next();
};


async function create(req, res, next){
    const { table } = res.locals.table;
    const data = await service.create(table)
    res.status(201).json({ data })
};



module.exports = {
    create:[validTableData,asyncErrorBoundary(create)]
}