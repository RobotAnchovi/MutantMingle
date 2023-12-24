//*====> backend/db/migrations/20231223005152-create-group.js <====
"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Groups",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        organizerId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id",
          },
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        about: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        type: {
          allowNull: false,
          type: Sequelize.STRING,
          validate: {
            isIn: [["Online", "In Person"]],
          },
        },
        private: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
        },
        city: {
          type: Sequelize.STRING,
        },
        state: {
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(options);
  },
};
