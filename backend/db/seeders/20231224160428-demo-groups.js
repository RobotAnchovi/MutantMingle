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
          organizerId: 2,
          name: "X-Men",
          about:
            "A team of mutant heroes fighting for peace and equal rights between humans and mutants.",
          type: "In Person",
          private: true,
          city: "Salem Center",
          state: "NY",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 3,
          name: "S.H.I.E.L.D.",
          about: "Specialized espionage and law-enforcement agency.",
          type: "In Person",
          private: true,
          city: "Washington",
          state: "D.C.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 4,
          name: "Fantastic Four",
          about:
            "A family of superhumans dedicated to scientific discovery and heroism.",
          type: "In Person",
          private: false,
          city: "New York",
          state: "NY",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 5,
          name: "Masters of the Mystic Arts",
          about: "Protectors of Earth against magical and mystical threats.",
          type: "Online",
          private: true,
          city: "New York",
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
