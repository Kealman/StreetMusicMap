/**
 * Created by Evgeniy on 24.03.15.
 */
"use strict";

var pg = require('lib/db/pg');

var Events = {};

Events.getAll = function(){
    return pg.select("id","name", "lat", "lng", "description")
             .from('events');
};

Events.addNewEvents = function(data){
    return pg('events')
      .insert({
        name: data.name,
        description: data.desc,
        lat: data.lat,
        lng: data.lng,
        user_id: data.user_id || null
      });
};


module.exports = Events;
