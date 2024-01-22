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
          url: "https://digitalcomicmuseum.com/thumbnails/15949.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 2,
          url: "https://digitalcomicmuseum.com/thumbnails/29249.jpg",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 3,
          url: "https://digitalcomicmuseum.com/thumbnails/12415.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 4,
          url: "https://digitalcomicmuseum.com/thumbnails/32167.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 5,
          url: "https://digitalcomicmuseum.com/thumbnails/26003.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 6,
          url: "https://digitalcomicmuseum.com/thumbnails/20423.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 7,
          url: "https://digitalcomicmuseum.com/thumbnails/18244.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 8,
          url: "https://digitalcomicmuseum.com/thumbnails/14178.jpg",
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
