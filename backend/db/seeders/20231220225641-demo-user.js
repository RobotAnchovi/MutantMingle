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
          lastName: "Miller",
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Dwayne",
          lastName: "Miller",
          email: "user1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Paul",
          lastName: "Miller",
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
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
        username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] },
      },
      {}
    );
  },
};
