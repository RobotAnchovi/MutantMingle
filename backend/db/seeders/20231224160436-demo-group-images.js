"use strict";

const { GroupImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate(
      [
        {
          groupId: 1,
          url: "https://digitalcomicmuseum.com/thumbnails/18532.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 2,
          url: "https://digitalcomicmuseum.com/thumbnails/27415.jpg",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 3,
          url: "https://digitalcomicmuseum.com/thumbnails/21480.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 4,
          url: "https://digitalcomicmuseum.com/thumbnails/31770.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 5,
          url: "https://digitalcomicmuseum.com/thumbnails/27276.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 6,
          url: "https://digitalcomicmuseum.com/thumbnails/27893.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 7,
          url: "https://digitalcomicmuseum.com/thumbnails/27281.jpg",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 8,
          url: "https://digitalcomicmuseum.com/thumbnails/23406.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 9,
          url: "https://digitalcomicmuseum.com/thumbnails/27297.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 10,
          url: "https://digitalcomicmuseum.com/thumbnails/27295.jpg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    await queryInterface.bulkDelete(options);
  },
};
