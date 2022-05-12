const service = require("./reservations.service.js")
const serviceDate = require("./reservations.service.date.js")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js")

// Checks reservations for the correct keys and properties. 
function validReser(req, res, next) {
      //status route passthrough
      if(req.params.reservationId && 
        (req.path.split("/").length === 3) && 
        req.method === "PUT"){
          return next()
        }

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

      if(res.locals.reservation.status && 
        (res.locals.reservation.status === "seated" || 
        res.locals.reservation.status === "finished")) {
          errorObj.message = ` reservation status: ${res.locals.reservation.status} cannot be seated or finished`;
          return next(errorObj)
        }

   return next()
}

// Checks reservations for the correct date format. 
function validReserDate(req, res, next){

  //status route passthrough
  if(req.params.reservationId && 
    (req.path.split("/").length === 3) && 
    req.method === "PUT"){
      return next()
  }

  const dateRegPat = /\d{4}-\d{2}-\d{2}/;
  const { reservation_date } = res.locals.reservation
  if(!reservation_date.match(dateRegPat)) {
    return next({status: 400, message: `reservation_date: ${reservation_date} is in the wrong format`})
  }
  return next()
}

// Checks reservations for the correct time format.
function validReserFormat(req, res, next){
    //status route passthrough
  if(req.params.reservationId && 
    (req.path.split("/").length === 3) && 
    req.method === "PUT"){
      return next()
  }

  const timeRegPat = /[0-9]{2}:[0-9]{2}/;
  const { reservation_time } = res.locals.reservation;
  if(!reservation_time.match(timeRegPat)) {
    return next({status: 400, message: `reservation_time: ${reservation_time} is in the wrong format`})
  };
  return next()
}

// Checks reservations for future date.
function vaildReserFuture(req, res, next){
    //status route passthrough
  if(req.params.reservationId && 
    (req.path.split("/").length === 3) && 
    req.method === "PUT"){
      return next()
  }
  const {reservation_date} = res.locals.reservation;
  res.locals.currentDay = new Date(serviceDate.today());
  res.locals.reserDate = new Date(reservation_date);

  if(res.locals.reserDate.getTime() < res.locals.currentDay.getTime()){
    return next({ status:400, message:`reservation_date: ${reservation_date} must be on a future date` })
  }
  return next();
}

// Checks reservations for a Tuesday (date closed).
function validReserCloseDate(req,res,next){
    //status route passthrough
    if(req.params.reservationId && 
      (req.path.split("/").length === 3) && 
      req.method === "PUT"){
        return next()
    }

  const {reservation_date} = res.locals.reservation;
  const formateDate = reservation_date.split("-")
  const reserDate = new Date(formateDate[0],formateDate[1]-1,formateDate[2]);
  if(reserDate.getDay() === 2){
    return next({ status:400, message:`reservation_date:${reservation_date} we are closed` })
  }

  return next();
}

// Checks reservations for open and close time. 
function validReserTime(req, res, next){
    //status route passthrough
    if(req.params.reservationId && 
      (req.path.split("/").length === 3) && 
      req.method === "PUT"){
        return next()
    }
  const {reservation_time} = res.locals.reservation;
  const reserTime = serviceDate.convertTime(reservation_time,true);
  if (reserTime[0] < ((10*60)+30)) {
    return next({status:400, message: `reservation_time: ${reservation_time} must be when we are open`})
  };

  if(reserTime[0] > ((21*60)+30)){
    return next({status:400, message: `reservation_time: ${reservation_time} must be before we close`})
  };

  if((res.locals.reserDate.getTime() === res.locals.currentDay.getTime()) && ((reserTime[0] < ((10*60)+30))|| (reserTime[0] > ((21*60)+30)))){
    return next({status:400, message: `reservation_time: ${reservation_time} must be in the future`})
  }
  return next()
}

// Checks reservations for a valid Id.
async function validReserId(req,res,next){
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId, "reservationId");

  if (reservation) {
    res.locals.reservation = reservation
    return next()
  }

  next({
    status: 404,
    message: `there is no reservation with reservationId: ${reservationId}`
  })

}

// Checks the status of a reservation. 
function validStatus(req, res, next){
  //update reservation route passthrough
  if(req.params.reservationId && 
    (req.path.split("/").length === 2) && 
    req.method === "PUT") {
      return next()
    }

  const acceptStatus = ["booked","seated","finished","cancelled"];
  if(req.body.data){
    res.locals.status = req.body.data
  } else {
    return next({
      status: 400,
      message: "Request body must have data key"
    });
  };

  if(!(res.locals.status.status === acceptStatus.find(status=>res.locals.status.status === status))){
    return next({
      status: 400,
      message: `status: ${res.locals.status.status} is not acceptable`
    });
  };

  if(res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: `status: ${res.locals.reservation.status} cannot be updated`
    })
  };

  return next();
}

async function update(req, res, next){

  if(res.locals.status) {
    res.locals.data = await service.update(res.locals.reservation.reservation_id, res.locals.status.status, "status")
  }

  if(!res.locals.status){
    const { reservationId } = req.params
    res.locals.data = await service.update(reservationId, res.locals.reservation, "reservation")
  }
  res.status(200).json({ data: res.locals.data })
}

function read(req, res, next){
  res.json({ data: res.locals.reservation })
};


async function list(req, res, _next) {

    if(req.query.date){
      const reservation_date = req.query.date;
      res.locals.data = await service.read(reservation_date, "date");
    }

    if(req.query.mobile_number) {
      const mobile_number = req.query.mobile_number
      res.locals.data = await service.read(mobile_number, "mobile")
    }
    
  res.json({ data: res.locals.data });
}

async function create(req, res, _next){
    const newReservation = await service.create(res.locals.reservation);
    res.status(201).json({ data: newReservation })

}
module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [validReser,validReserDate,validReserFormat,vaildReserFuture,validReserCloseDate,validReserTime,asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(validReserId), read],
  update: [asyncErrorBoundary(validReserId),validReser,validReserDate,validReserFormat,vaildReserFuture,validReserCloseDate,validReserTime,validStatus,asyncErrorBoundary(update)]
};
