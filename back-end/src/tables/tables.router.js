const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");



router.route("/:table_id/seat")
    .put(controller.update);

router.route("/")
    .get(controller.list)
    .post(controller.create);




module.exports = router;