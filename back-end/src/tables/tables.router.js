const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

// Default configuration for Cross-Origin
const corsConfig = cors({
    "origin": "*", //front-end url in production
    "methods": ['GET','PUT','POST','DELETE']
});

// End point for table seating calls.
router.route("/:table_id/seat")
    .put(corsConfig,controller.update)
    .delete(corsConfig,controller.delete)
    .options(corsConfig)
    .all(methodNotAllowed);

// End point for table calls. 
router.route("/")
    .get(corsConfig,controller.list)
    .post(corsConfig,controller.create)
    .options(corsConfig)
    .all(methodNotAllowed);

module.exports = router;