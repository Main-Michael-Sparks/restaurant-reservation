const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//
//router.route("/:table_id/seat")

//router.route("/:table_id")
//    .get(controller.read)

router.route("/")
    //.get(controller.list)
    .post(controller.create);




module.exports = router;