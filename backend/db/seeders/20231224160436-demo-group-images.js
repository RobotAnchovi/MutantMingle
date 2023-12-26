//*====> backend/db/seeders/20231224160436-demo-group-images.js <====
"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "GroupImages",
      [
        {
          groupId: 1, // Corresponds to 'The Avengers'
          url: "", // Placeholder for image URL
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 2, // Corresponds to 'Science Bros'
          url: "", // Placeholder for image URL
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 3, // Corresponds to 'Stark Industries R&D'
          url: "", // Placeholder for image URL
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 4, // Corresponds to 'S.H.I.E.L.D. Espionage'
          url: "", // Placeholder for image URL
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 5, // Corresponds to 'Heroes for Justice'
          url: "", // Placeholder for image URL
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("GroupImages", null, options);
  },
};
