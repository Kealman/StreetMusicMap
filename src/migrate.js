'use strict';

var fs = require('fs'),
  _ = require('lodash'),
  path = require('path'),
  Promise = require('bluebird');

var Migrate = require('knex/lib/migrate');


Migrate.prototype._listAll = function() {
  return Promise.promisify(fs.readdir, fs)('./migrations')
    .bind(this)
    .then(function(migrations) {
      return _.filter(migrations, function(value) {
        var extension = path.extname(value);
        return _.contains(['.co', '.coffee', '.iced', '.js', '.litcoffee', '.ls', '.sql'], extension);
      }).sort();
    });
};

Migrate.prototype._validateMigrationStructure = function(name) {
  var filename = path.join(this._absoluteConfigDir(), name),
    ext = path.extname(filename);

  if (ext !== '.sql') {
    var migration = require(filename);
    if (!_.isFunction(migration.up) || !_.isFunction(migration.down)) {
      throw new Error('Invalid migration: ' + name + ' must have both an up and down function');
    }
  } else if (ext === '.sql') {
    var body = fs.readFileSync(filename).toString();
    if (!body.match(/\--\s#UP/) && !body.match(/\--\s#DOWN/)){
      throw new Error('Invalid migration: ' + name + ' must have both an up and down function');
    }
  }
  return name;
};

Migrate.prototype._waterfallBatch = function(batchNo, migrations, direction) {
  var knex      = this.knex;
  var tableName = this.config.tableName;
  var directory = this._absoluteConfigDir();
  var current   = Promise.bind({failed: false, failedOn: 0});
  var log       = [];
  _.each(migrations, function(migration) {
    var name  = migration;
    if (path.extname(name) !== '.sql') {
      migration = require(directory + '/' + name);

    } else {
      var body = fs.readFileSync(directory + '/' + name).toString();
      var up = body.substring(0, body.indexOf('-- #DOWN'));
      var down = body.substring(body.indexOf('-- #DOWN'));
      migration = {
        up: function(knex){
          return knex.raw(up);
        },

        down: function(knex){
          return knex.raw(down);
        }
      };
    }

    // We're going to run each of the migrations in the current "up"
    current = current.then(function () {
      return migration[direction](knex, Promise);
    }).then(function () {
      log.push(path.join(directory, name));
      if (direction === 'up') {
        return knex(tableName).insert({
          name: name,
          batch: batchNo,
          migration_time: new Date()
        });
      }
      if (direction === 'down') {
        return knex(tableName).where({name: name}).del();
      }
    });
  });

  return current.thenReturn([batchNo, log]);
};


