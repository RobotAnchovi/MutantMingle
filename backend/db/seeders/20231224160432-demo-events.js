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
          venueId: 1, // valid venue IDs
          groupId: 1, // valid group IDs
          name: "Jewel Conference 2021",
          description:
            "An annual conference for jewelers, rich people and gold enthusiasts.",
          type: "In person",
          capacity: 500,
          price: 299.4,
          startDate: new Date(2024, 9, 10),
          endDate: new Date(2024, 9, 12),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          venueId: 2,
          groupId: 2,
          name: "Local Hack Day",
          description: "Hackathon event for local developers.",
          type: "In person",
          capacity: 100,
          price: 0, //free event
          startDate: new Date(2024, 10, 5),
          endDate: new Date(2024, 10, 5),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          venueId: 2,
          groupId: 5,
          name: "Virtual Reality Expo",
          description: "Explore the latest in VR technology.",
          type: "Online",
          capacity: 200,
          price: 150.11,
          startDate: new Date(2024, 11, 1),
          endDate: new Date(2024, 11, 3),
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
          groupId: 5,
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
        {
          venueId: 1,
          groupId: 1,
          name: "Gemstone Gala 2020",
          description:
            "A spectacular gathering for gemstone aficionados and luxury collectors.",
          type: "In person",
          capacity: 450,
          price: 350.0,
          startDate: new Date(2020, 8, 15), // September 15, 2020
          endDate: new Date(2020, 8, 17), // September 17, 2020
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          venueId: 1,
          groupId: 1,
          name: "Diamonds & Designs 2019",
          description:
            "An exclusive event showcasing the latest trends in diamond jewelry and design.",
          type: "In person",
          capacity: 400,
          price: 400.0,
          startDate: new Date(2019, 10, 10), // November 10, 2019
          endDate: new Date(2019, 10, 12), // November 12, 2019
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          venueId: 1,
          groupId: 1,
          name: "Luxury Watch Expo 2022",
          description:
            "A premier expo for luxury watch enthusiasts, featuring world-renowned brands.",
          type: "In person",
          capacity: 500,
          price: 250.0,
          startDate: new Date(2022, 5, 20), // June 20, 2022
          endDate: new Date(2022, 5, 22), // June 22, 2022
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    ).catch((err) => {
      throw err;
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    await queryInterface.bulkDelete(options);
  },
};
