/**
 * Created by Evgeniy on 24.03.15.
 */
"use strict";

var pg = require('lib/db/pg');

var Events = {};

Events.getAll = function(){
    return pg.select("name", "lat", "lng")
             .from('events');
};


module.exports = Events;
