"use strict";

const { Group } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Group.bulkCreate(
      [
        {
          organizerId: 1,
          name: "League of Urban Pillagers",
          about:
            "Unite with fellow adventurers to rob...I mean discover the city's hidden gems!",
          type: "In person",
          private: false,
          city: "San Francisco",
          state: "CA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 2,
          name: "Tech Titans Roundtable",
          about:
            "Join the league of extraordinary minds discussing the future of tech!",
          type: "Online",
          private: false,
          city: "Los Angeles",
          state: "CA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 3,
          name: "Mystery & Myth Book Club",
          about:
            "Dive into the world of fiction and non-fiction mysteries every month!",
          type: "In person",
          private: true,
          city: "New York",
          state: "NY",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 4,
          name: "Cinematic Crusaders",
          about:
            "Weekly gatherings for cinema enthusiasts to watch and analyze films!",
          type: "In person",
          private: false,
          city: "Seattle",
          state: "WA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 5,
          name: "Gourmet Guild",
          about:
            "Exchange extraordinary recipes and culinary secrets while battling the evil villain: Count Cholesterol!",
          type: "Online",
          private: false,
          city: "San Francisco",
          state: "CA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 6,
          name: "Wellness Warriors",
          about:
            "Join forces to embark on fitness and wellness quests! Fighting fat and making gains! Where's my protein!!!",
          type: "In person",
          private: false,
          city: "Chicago",
          state: "IL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 7,
          name: "Strategic Superheroes",
          about:
            "Conquer board games and strategies at our epic game nights all while my mom makes HotPockets!",
          type: "Online",
          private: true,
          city: "Boston",
          state: "MA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 8,
          name: "Melody Masters Assembly",
          about:
            "Gather with fellow music aficionados and create harmonious symphonies together!",
          type: "In person",
          private: false,
          city: "Nashville",
          state: "TN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 9,
          name: "Canvas Crusaders",
          about:
            "A consortium for artists to unite, create, and showcase their masterpieces!",
          type: "Online",
          private: true,
          city: "Miami",
          state: "FL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 10,
          name: "Eco Avengers",
          about:
            "Discuss and delve into the art of gardening and nurturing our planet! Become a Planeteer!",
          type: "In person",
          private: false,
          city: "Denver",
          state: "CO",
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
