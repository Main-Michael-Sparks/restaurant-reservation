const service = require("./reservations.service.js")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js")
/**
 * List handler for reservation resources
 */

async function list(req, res) {
  const reservation_date = req.query.date;
  const resDates = await service.read(reservation_date);
  res.json({data: resDates});
}

async function create(req, res, _next){
    res.locals.body = req.body.data // delete if never resued outside of create function
    const newRes = await service.create(res.locals.body);
    res.status(201).json({data: newRes})

}
module.exports = {
  list: [asyncErrorBoundary(list)],
  create:[asyncErrorBoundary(create)]
};
