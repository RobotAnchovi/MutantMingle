//*====> backend/db/seeders/20231224160512-demo-attendances.js <====
"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Attendances",
      [
        {
          userId: 1, // Peter Parker attending an event
          eventId: 1, // Corresponds to an event, e.g., 'Avengers Assembly'
          status: "attending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2, // Tony Stark attending an event
          eventId: 3, // Corresponds to 'Stark Expo'
          status: "attending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3, // Steve Rogers on the waitlist for an event
          eventId: 5, // Corresponds to 'Fantastic Four Science Fair'
          status: "waitlist",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 4, // Bruce Banner pending for an event
          eventId: 2, // Corresponds to 'S.H.I.E.L.D. Recruitment'
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 5, // Natasha Romanoff attending an event
          eventId: 4, // Corresponds to 'X-Men Training Session'
          status: "attending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        //^ ... More entries can be added as needed
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Attendances", null, options);
  },
};
