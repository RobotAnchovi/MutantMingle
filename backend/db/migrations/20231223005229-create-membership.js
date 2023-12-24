//*====> backend/db/migrations/20231223005229-create-membership.js <====
"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Memberships",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
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
        status: {
          allowNull: false,
          type: Sequelize.STRING,
          validate: {
            isIn: [["co-host", "member", "pending"]],
          },
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
