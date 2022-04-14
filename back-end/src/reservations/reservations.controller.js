const service = require("./reservations.service.js")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js")
/**
 * List handler for reservation resources
 */

async function list(req, res) {
  // pull by get and query:params
  res.json({
    data: [],
  });
}

async function create(req, res, _next){
    res.locals.body = req.body.data
    console.log("service side",res.locals.body)
    const newRes = await service.create(res.locals.body);
    console.log(newRes)
    res.status(201).json({data: newRes})

}
module.exports = {
  list: [asyncErrorBoundary(list)],
  create:[asyncErrorBoundary(create)]
};
