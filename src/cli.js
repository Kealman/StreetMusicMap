#!/usr/bin/env node

'use strict';

require('./migrate');

var db = require('./lib/db/pg'),
  fs = require('fs');

var program = require('commander');

program
  .version(require('../package.json').version)
  .command('migrate:make <name>')
  .option('--js', 'JavaScript Format')
  .description('Create new migration')
  .action(wrapAction(makeMigration));

program
  .command('migrate:rollback')
  .description('Migrate database down')
  .alias('migrate:down')
  .action(wrapAction(migrateDown));

program
  .command('migrate:latest')
  .description('Migrate database up')
  .alias('migrate:up')
  .action(wrapAction(migrateUp));


function wrapAction(fn){
  return function(){
    fn.apply(null, arguments).then(()=>{
      console.log('Success');
      process.exit(0);
    }, (err)=>{
      console.log('Failed');
      console.trace(err);
      process.exit(1);
    });
  };
}

const MIGRATE_TEMPLATE_SQL = `-- #Migration %name%
-- #UP


-- #DOWN
`;

const MIGRATE_TEMPLATE_JS = `'use strict';

exports.up = function(knex){

};

exports.down = function(knex){

};

`;

function makeMigration(name, options){
  var padDate = function(segment) {
    segment = segment.toString();
    return segment[1] ? segment : '0' + segment;
  };

  var yyyymmddhhmmss = function() {
    var d = new Date();
    return d.getFullYear().toString() +
      padDate(d.getMonth() + 1) +
      padDate(d.getDate()) +
      padDate(d.getHours()) +
      padDate(d.getMinutes()) +
      padDate(d.getSeconds());
  };

  if (name[0] === '-') {
    name = name.slice(1);
  }
  var filename = yyyymmddhhmmss() + '-' + name + '.' +  (options.js ? 'js' : 'sql');
  var body = (options.js ? MIGRATE_TEMPLATE_JS : MIGRATE_TEMPLATE_SQL).replace(/\%name\%/gi, name);
  fs.writeFileSync('./migrations/' + filename, body);
  return new Promise(res => res());
}

function migrateUp(){
  return db.migrate.latest().then(function(result){
    result[1].forEach(n => console.log(n));
  });
}

function migrateDown(){
  return db.migrate.rollback().then(function(result){
    result[1].forEach(n => console.log(n));
  });
}

program.parse(process.argv);
