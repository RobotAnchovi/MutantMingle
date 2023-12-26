//*====> backend/db/seeders/202312241604XX-demo-memberships.js <====
"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Bulk inserting data into the Memberships table
    await queryInterface.bulkInsert(
      "Memberships",
      [
        {
          userId: 1, // Peter Parker
          groupId: 1, // The Avengers
          status: "member",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2, // Tony Stark
          groupId: 3, // Stark Industries R&D
          status: "co-host",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3, // Steve Rogers
          groupId: 5, // Heroes for Justice
          status: "member",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 4, // Bruce Banner
          groupId: 2, // Science Bros
          status: "member",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 5, // Natasha Romanoff
          groupId: 4, // S.H.I.E.L.D. Espionage
          status: "co-host",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        //^ ... Add more memberships as needed
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Memberships", null, options);
  },
};
