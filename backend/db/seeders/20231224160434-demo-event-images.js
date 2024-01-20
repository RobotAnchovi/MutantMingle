"use strict";

const { EventImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await EventImage.bulkCreate(
      [
        {
          eventId: 1, // Replace with actual event IDs from Events table
          url: "image url",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 1,
          url: "image url",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 2,
          url: "image url",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 3,
          url: "image url",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 4,
          url: "image url",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    await queryInterface.bulkDelete(options);
  },
};
