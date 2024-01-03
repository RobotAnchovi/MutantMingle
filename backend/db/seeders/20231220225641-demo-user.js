//*====> backend/db/seeders/20231220225641-demo-user.js <====
"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { ValidationError } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "Peter",
          lastName: "Parker",
          email: "spiderman@marvel.io",
          username: "SpideyTingles62",
          hashedPassword: bcrypt.hashSync("SpideyPassword"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Tony",
          lastName: "Stark",
          email: "ironman@marvel.io",
          username: "IamThatDude63",
          hashedPassword: bcrypt.hashSync("IronManPassword"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Steve",
          lastName: "Rogers",
          email: "captainamerica@marvel.io",
          username: "CaptainSteve40",
          hashedPassword: bcrypt.hashSync("CaptainPassword"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Bruce",
          lastName: "Banner",
          email: "hulk@marvel.io",
          username: "HulkSmash62",
          hashedPassword: bcrypt.hashSync("HulkPassword"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Natasha",
          lastName: "Romanoff",
          email: "blackwidow@marvel.io",
          username: "MsStealYoMan64",
          hashedPassword: bcrypt.hashSync("BlackWidowPassword"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Thor",
          lastName: "Odinson",
          email: "thor@marvel.io",
          username: "GodOfThunder62",
          hashedPassword: bcrypt.hashSync("MjolnirPassword"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    ).catch((err) => {
      if (err instanceof ValidationError) {
        throw err.message;
      } else {
        console.log(err);
        for (let error of err.errors) {
          console.log(error.record);
          console.log(error.message);
        }
        throw err.errors;
      }
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "SpideyTingles62",
            "IamThatDude63",
            "CaptainSteve40",
            "HulkSmash62",
            "MsStealYoMan64",
            "GodOfThunder62",
          ],
        },
      },
      {}
    );
  },
};
