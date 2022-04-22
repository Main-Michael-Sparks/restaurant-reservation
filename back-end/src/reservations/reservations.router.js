/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");


router.route("/")
    .get(controller.list)
    .post(controller.create);
    //.all(methodNotAllowed); // handle preflightRequests before adding this

module.exports = router;
