/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

// Default configuration for Cross-Origin
const corsConfig = cors({
    "origin": "*", //front-end url in production
    "methods": ['GET','PUT','POST']
})

// End point for reservation status calls.
router.route("/:reservationId/status")
    .put(corsConfig,controller.update)
    .options(corsConfig)
    .all(methodNotAllowed);

// End point for reservation id calls. 
router.route("/:reservationId")
    .get(corsConfig,controller.read)
    .put(corsConfig,controller.update)
    .options(corsConfig)
    .all(methodNotAllowed);

// End point for reservation calls.
router.route("/")
    .get(corsConfig,controller.list)
    .post(corsConfig,controller.create)
    .options(corsConfig)
    .all(methodNotAllowed);

module.exports = router;