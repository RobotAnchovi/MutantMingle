"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Events",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        venueId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Venues",
            key: "id",
          },
        },
        groupId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Groups",
            key: "id",
          },
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.TEXT,
        },
        type: {
          allowNull: false,
          type: Sequelize.STRING,
          validate: {
            isIn: [["Online", "In Person"]],
          },
        },
        capacity: {
          type: Sequelize.INTEGER,
        },
        price: {
          type: Sequelize.INTEGER,
        },
        startDate: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        endDate: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          ),
        },
      },
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Events", options);
  },
};
