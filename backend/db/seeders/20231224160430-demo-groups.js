//*====> backend/db/seeders/20231224160428-demo-groups.js <====
"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Groups",
      [
        {
          organizerId: 1,
          name: "The Avengers",
          about:
            "Earth's Mightiest Heroes united to fight the foes no single hero could withstand.",
          type: "In Person",
          private: false,
          city: "New York",
          state: "NY",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 4,
          name: "Science Bros",
          about:
            "A group for discussing science, technology, and gamma radiation research.",
          type: "In Person",
          private: true,
          city: "New York",
          state: "NY",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 2,
          name: "Stark Industries R&D",
          about:
            "Research and development group for Stark Industries' latest tech.",
          type: "Online",
          private: true,
          city: "New York",
          state: "NY",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 5,
          name: "S.H.I.E.L.D. Espionage",
          about: "Training and resources for S.H.I.E.L.D. agents.",
          type: "In Person",
          private: true,
          city: "Washington",
          state: "D.C.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 3,
          name: "Heroes for Justice",
          about: "A group dedicated to community service and heroism.",
          type: "In Person",
          private: false,
          city: "Brooklyn",
          state: "NY",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Groups", null, options);
  },
};
