/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
//const methodNotAllowed = require("../errors/methodNotAllowed");

// End point for reservation status calls.
router.route("/:reservationId/status")
    .put(controller.update)

// End point for reservation id calls. 
router.route("/:reservationId")
    .get(controller.read)
    .put(controller.update)

// End point for reservation calls.
router.route("/")
    .get(controller.list)
    .post(controller.create);

module.exports = router;