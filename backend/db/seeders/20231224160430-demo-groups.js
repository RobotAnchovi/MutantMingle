"use strict";

const { Group } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Group.bulkCreate(
      [
        {
          organizerId: 1,
          name: "Outdoor Adventures",
          about: "A group for outdoor enthusiasts",
          type: "In person",
          private: false,
          city: "San Francisco",
          state: "CA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 1,
          name: "Tech Talks",
          about: "Discussing the latest in technology",
          type: "Online",
          private: false,
          city: "New York",
          state: "NY",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 1,
          name: "Book Club",
          about: "Monthly fiction and non-fiction book discussions",
          type: "In person",
          private: true,
          city: "Chicago",
          state: "IL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 3,
          name: "Movie Nights",
          about: "Weekly gatherings to watch and discuss movies",
          type: "In person",
          private: false,
          city: "Los Angeles",
          state: "CA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 2,
          name: "Culinary Cooks",
          about: "Share recipes and cooking techniques",
          type: "Online",
          private: false,
          city: "Seattle",
          state: "WA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    await queryInterface.bulkDelete(options);
  },
};
