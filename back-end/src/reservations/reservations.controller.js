const service = require("./reservations.service.js")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js")
/**
 * List handler for reservation resources
 */

async function list(req, res) {
  console.log(req.params)
  res.json({
    data: req.params
  });
}

async function create(req, res, _next){
    res.locals.body = req.body.data
    const newRes = await service.create(res.locals.body);
    res.status(201).json({data: newRes})

}
module.exports = {
  list: [asyncErrorBoundary(list)],
  create:[asyncErrorBoundary(create)]
};
