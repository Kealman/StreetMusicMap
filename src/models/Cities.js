/**
 * Created by Evgeniy on 24.03.15.
 */
"use strict";

var pg = require('lib/db/pg');

var Cities = {};

Cities.getAll = function(){
  return pg.select("id","name", "lat", "lng", "zoom")
    .from('cities');
};


module.exports = Cities;
