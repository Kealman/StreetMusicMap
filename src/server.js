/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/environment');
var mount = require('koa-mount');
var bodyParser = require('koa-bodyparser');


// Bootstrap server
var app = require('koa')();
app.use(bodyParser());
require('./config/koa')(app);
require('./config/routes')(app);

// Start server
if (!module.parent) {
	app.listen(config.port, config.ip, function () {
  	console.log('Koa server listening on %d, in %s mode', config.port, config.env);
	});
}

// Expose app
exports = module.exports = app;
