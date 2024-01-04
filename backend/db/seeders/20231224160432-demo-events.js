"use strict";

const { Event } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Event.bulkCreate(
      [
        {
          venueId: 1,
          groupId: 1,
          name: "Tech Conference 2021",
          description: "An annual conference for tech enthusiasts.",
          type: "In person",
          capacity: 500,
          price: 299,
          startDate: new Date(2021, 9, 10),
          endDate: new Date(2021, 9, 12),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          venueId: 2,
          groupId: 2,
          name: "Local Hack Day",
          description: "Hack-a-thon event for local developers.",
          type: "In person",
          capacity: 100,
          price: 0,
          startDate: new Date(2021, 10, 5),
          endDate: new Date(2021, 10, 5),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          venueId: 1,
          groupId: 1,
          name: "Virtual Reality Expo",
          description: "Explore the latest in VR technology.",
          type: "Online",
          capacity: 200,
          price: 150,
          startDate: new Date(2021, 11, 1),
          endDate: new Date(2021, 11, 3),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          venueId: 3,
          groupId: 3,
          name: "Outdoor Photography Workshop",
          description: "Learn outdoor photography techniques.",
          type: "In person",
          capacity: 50,
          price: 200,
          startDate: new Date(2021, 12, 15),
          endDate: new Date(2021, 12, 17),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          venueId: 2,
          groupId: 4,
          name: "Cooking Masterclass",
          description: "Cooking class by renowned chef.",
          type: "Online",
          capacity: 30,
          price: 100,
          startDate: new Date(2022, 1, 20),
          endDate: new Date(2022, 1, 20),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    ).catch((err) => {
      console.log(err);
      throw err;
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    return queryInterface.bulkDelete(options);
  },
};
