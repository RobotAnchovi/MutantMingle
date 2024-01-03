//*====> backend/db/seeders/20231224160413-demo-events.js <====
"use strict";
const { Event } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await Event.bulkCreate(
      [
        {
          venueId: 1,
          groupId: 1,
          name: "Avengers Assembly",
          description: "Gathering of Earth's Mightiest Heroes.",
          type: "In Person",
          capacity: 100,
          price: 0,
          startDate: new Date(),
          endDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          venueId: 2,
          groupId: 2,
          name: "S.H.I.E.L.D. Recruitment",
          description: "Open day for new S.H.I.E.L.D. agent recruitment.",
          type: "In Person",
          capacity: 150,
          price: 0,
          startDate: new Date(),
          endDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          venueId: 3,
          groupId: 3,
          name: "X-Men Training Session",
          description: "Training for young mutants.",
          type: "In Person",
          capacity: 30,
          price: 0,
          startDate: new Date(),
          endDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          venueId: 4,
          groupId: 4,
          name: "Stark Expo",
          description: "Exhibition of Stark Industries' latest tech.",
          type: "In Person",
          capacity: 200,
          price: 10,
          startDate: new Date(),
          endDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          venueId: 5,
          groupId: 5,
          name: "Fantastic Four Science Fair",
          description: "Showcasing groundbreaking scientific discoveries.",
          type: "In Person",
          capacity: 80,
          price: 5,
          startDate: new Date(),
          endDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Events", null, options);
  },
};
