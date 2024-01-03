"use strict";

const { Attendance } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Attendance.bulkCreate(
      [
        {
          eventId: 1,
          userId: 1,
          status: "attending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 1,
          userId: 2,
          status: "waitlist",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 2,
          userId: 1,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 3,
          userId: 3,
          status: "attending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 4,
          userId: 1,
          status: "attending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Attendances";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        // Adjust the condition to match the records you want to delete
        id: { [Op.in]: [1, 2, 3, 4, 5] },
      },
      {}
    );
  },
};
