'use strict';

exports.up = function(knex) {
  return knex.schema.createTable("events", function(table){

    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.text('description');
    table.float('lat').notNullable();
    table.float('lng').notNullable();

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("events");
};

