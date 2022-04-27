const service = require("./reservations.service.js")
const serviceDate = require("./reservations.service.date.js")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js")
/**
 * List handler for reservation resources
 */

function validReser(req, res, next) {
  // refactor for muliple errors
  // pass down an array nest errors?
  // use a helper function to validate object props
      const errorObj = {status: 400, message:''}

      if (!req.body.data) {
        errorObj.message = "data key is missing"
        return next(errorObj)
      } else {
        res.locals.reservation = req.body.data;
      }

      if(!res.locals.reservation){
        errorObj.message = "data key is missing"
        return next(errorObj)
      }

      if(!res.locals.reservation.first_name){
        errorObj.message = 'Reservation must have first_name'
        return next(errorObj)
      }
      if(!res.locals.reservation.last_name){
        errorObj.message = 'Reservation must have last_name'
        return next(errorObj)
      }
      if(!res.locals.reservation.mobile_number){
        errorObj.message = 'Reservation must have mobile_number'
        return next(errorObj)
      }
      if(!res.locals.reservation.reservation_time){
        errorObj.message = 'Reservation must have reservation_time'
        return next(errorObj)
      }
      if(!res.locals.reservation.reservation_date){
        errorObj.message = 'Reservation must have reservation_date'
        return next(errorObj)
      }
      if(!res.locals.reservation.people || 
        !Number.isInteger(res.locals.reservation.people) || 
        res.locals.reservation.people < 1 ){
        errorObj.message = 'Reservation must have some number of people'
        return next(errorObj)
      }
   return next()
}

function validReserDate(req, res, next){
  const dateRegPat = /\d{4}-\d{2}-\d{2}/;
  const { reservation_date } = res.locals.reservation
  if(!reservation_date.match(dateRegPat)) {
    return next({status: 400, message: `reservation_date: ${reservation_date} is in the wrong format`})
  }
  return next()
}
function validReserTime(req, res, next){
  const timeRegPat = /[0-9]{2}:[0-9]{2}/;
  const { reservation_time } = res.locals.reservation;
  if(!reservation_time.match(timeRegPat)) {
    return next({status: 400, message: `reservation_time: ${reservation_time} is in the wrong format`})
  };
  return next()
}

// /returns 400 if reservation occurs in the past
// /returns 400 if reservation_date falls on a tuesday

function vaildReserFuture(req, res, next){
  const {reservation_date} = res.locals.reservation;
  const currentDay = new Date(serviceDate.today());
  const reserDate = new Date(reservation_date);

  if(reserDate.getTime() < currentDay.getTime()){
    return next({ status:400, message:`reservation_date: ${reservation_date} must be on a future date` })
  }
  return next();
}

function validReserCloseDate(req,res,next){
  const {reservation_date} = res.locals.reservation;
  const reserDate = new Date(reservation_date)
  if(reserDate.getDay() === 1){
    return next({ status:400, message:`reservation_date:${reservation_date} we are closed` })
  }
  return next();
}

async function list(req, res, _next) {
  const reservation_date = req.query.date;
  const resDates = await service.read(reservation_date);
  res.json({ data: resDates });
}

async function create(req, res, _next){
    const newReservation = await service.create(res.locals.reservation);
    res.status(201).json({ data: newReservation })

}
module.exports = {
  list: [asyncErrorBoundary(list)],
  create:[validReser,validReserDate,validReserTime,vaildReserFuture,validReserCloseDate,asyncErrorBoundary(create)]
};
