const service = require("./reservations.service.js")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js")
/**
 * List handler for reservation resources
 */

function validateReservation(req, res, next) {
  // refactor for muliple errors
  // pass down an array nest errors?
  // use a helper function to validate object props
    res.locals.reservation = req.body.data
      const errorObj = {status: 400, message:''}
      if(!res.locals.reservation.first_name){
        errorObj.message = 'Reservation must have first name'
        return next(errorObj)
      }
      if(!res.locals.reservation.last_name){
        errorObj.message = 'Reservation must have last name'
        return next(errorObj)
      }
      if(!res.locals.reservation.mobile_number){
        errorObj.message = 'Reservation must have mobile number'
        return next(errorObj)
      }
      if(!res.locals.reservation.reservation_time){
        errorObj.message = 'Reservation must have reservation time'
        return next(errorObj)
      }
      if(!res.locals.reservation.reservation_date){
        errorObj.message = 'Reservation must have reservation date'
        return next(errorObj)
      }
      if(res.locals.reservation.people < 1 ){
        errorObj.message = 'Reservation must have at least 1 person'
        return next(errorObj)
      }
    next()
}

async function list(req, res) {
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
  create:[validateReservation,asyncErrorBoundary(create)]
};
