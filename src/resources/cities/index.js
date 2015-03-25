'use strict';

var controller = require('./cities.controller');
var router = require('koa-router')();

router.get('/', controller.index);
module.exports = router.routes();
