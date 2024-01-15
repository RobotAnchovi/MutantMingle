"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "Demo",
          lastName: "Man",
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Dwayne",
          lastName: "Walker",
          email: "user1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Logan",
          lastName: "Fate",
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "Tony",
          lastName: "Stark",
          email: "ironman@user.io",
          username: "IronMan",
          hashedPassword: bcrypt.hashSync("password4"),
        },
        {
          firstName: "Steve",
          lastName: "Rogers",
          email: "cap@user.io",
          username: "CaptainAmerica",
          hashedPassword: bcrypt.hashSync("password5"),
        },
        {
          firstName: "Peter",
          lastName: "Parker",
          email: "spiderman@user.io",
          username: "SpiderMan",
          hashedPassword: bcrypt.hashSync("password6"),
        },
        {
          firstName: "Bruce",
          lastName: "Banner",
          email: "hulk@user.io",
          username: "Hulk",
          hashedPassword: bcrypt.hashSync("password7"),
        },
        {
          firstName: "Natasha",
          lastName: "Romanoff",
          email: "blackwidow@user.io",
          username: "BlackWidow",
          hashedPassword: bcrypt.hashSync("password8"),
        },
        {
          firstName: "Thor",
          lastName: "Odinson",
          email: "thor@user.io",
          username: "Thor",
          hashedPassword: bcrypt.hashSync("password9"),
        },
        {
          firstName: "Stephen",
          lastName: "Strange",
          email: "doctorstrange@user.io",
          username: "DoctorStrange",
          hashedPassword: bcrypt.hashSync("password10"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "Demo-lition",
            "FakeUser1",
            "FakeUser2",
            "IronMan",
            "CaptainAmerica",
            "SpiderMan",
            "Hulk",
            "BlackWidow",
            "Thor",
            "DoctorStrange",
          ],
        },
      },
      {}
    );
  },
};
