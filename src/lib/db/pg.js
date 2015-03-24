var config = require('../../config/environment');

var knex = require("knex")({
    client: "pg",
    connection: config.pg,
    debug: true
});

//require("lib/util/knexExtend")(knex);


module.exports = knex;
