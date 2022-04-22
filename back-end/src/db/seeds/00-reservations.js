const jsonSeed = require("./00-reservations.json")

exports.seed = function (knex) {
  return knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(()=>knex.insert(jsonSeed).into('reservations'))
};
