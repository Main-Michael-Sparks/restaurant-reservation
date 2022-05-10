const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// End point for table seating calls.
router.route("/:table_id/seat")
    .put(controller.update)
    .delete(controller.delete);

// End point for table calls. 
router.route("/")
    .get(controller.list)
    .post(controller.create);

module.exports = router;