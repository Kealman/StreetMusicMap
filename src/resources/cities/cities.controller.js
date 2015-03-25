'use strict';
var Cities = require('models/Cities');

exports.index = function*(next) {
  var cities = yield Cities.getAll();

  this.status = 200;
  this.body = cities;
};
