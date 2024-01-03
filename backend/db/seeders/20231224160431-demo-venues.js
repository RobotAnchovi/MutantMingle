//*====> backend/db/seeders/<timestamp>-demo-venues.js <====
"use strict";
const { Venue } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Venue.bulkCreate(
      [
        {
          groupId: 1,
          address: "890 Fifth Avenue",
          city: "New York",
          state: "NY",
          lat: 40.7746,
          lng: -73.9653,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 2,
          address: "177A Bleecker Street",
          city: "New York",
          state: "NY",
          lat: 40.7289,
          lng: -73.9994,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 3,
          address: "Xavier's School for Gifted Youngsters",
          city: "Salem Center",
          state: "NY",
          lat: 41.3325,
          lng: -73.6972,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 4,
          address: "Stark Tower",
          city: "New York",
          state: "NY",
          lat: 40.7567,
          lng: -73.9783,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 5,
          address: "Baxter Building",
          city: "New York",
          state: "NY",
          lat: 40.7564,
          lng: -73.9832,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Venues", null, options);
  },
};
