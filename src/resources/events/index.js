'use strict';

var controller = require('./events.controller');
var router = require('koa-router')();

router.get('/', controller.index);
router.post('/', controller.create);
module.exports = router.routes();
