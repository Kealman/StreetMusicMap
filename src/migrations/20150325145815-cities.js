'use strict';

exports.up = function(knex) {
  return knex.schema.createTable("cities", function(table){

    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.float('lat').notNullable();
    table.float('lng').notNullable();
    table.integer('zoom').notNullable();

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("cities");
};

