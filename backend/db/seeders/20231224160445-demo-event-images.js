//*====> backend/db/seeders/20231224160445-demo-event-images.js <====
"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "EventImages",
      [
        {
          eventId: 1, // Image for 'Avengers Assembly' event
          url: "",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 2, // Image for 'S.H.I.E.L.D. Recruitment' event
          url: "",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 3, // Image for 'Stark Expo' event
          url: "",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 4, // Image for 'X-Men Training Session' event
          url: "",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 5, // Image for 'Fantastic Four Science Fair' event
          url: "",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    // Revert the seed data
    return queryInterface.bulkDelete("EventImages", null, options);
  },
};
