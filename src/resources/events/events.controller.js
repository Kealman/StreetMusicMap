'use strict';
var Events = require('models/Events');

exports.index = function*(next) {
  var events = yield Events.getAll();

	this.status = 200;
  this.body = events;
};

exports.create = function*(next) {
  yield Events.addNewEvents(this.request.body);
  this.status = 204;
};
