'use strict';

var asyncFunc = function(){
  return new Promise(function(res, rej){
    setTimeout(function(){
       res("Async func");
    });
  });
};

var genFunc = function*(){
    return yield asyncFunc();
};

// Get list of roots
exports.index = function*(next) {
	//this.status = 403;
  //this.body = {
  //	name : 'StreetMusicMap',
  //	info : 'docs'
  //};
  console.log("Before start");
  var a = yield genFunc();
  console.log(a);
  console.log("end");
  this.body = {
    test: 'test'
  }
};
