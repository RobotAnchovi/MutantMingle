//*====> backend/db/models/membership.js <====
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    static associate(models) {
      // define association here
      Membership.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Membership.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "group",
      });
    }
  }

  Membership.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        allowNull: false,
      },
      groupId: {
        type: DataTypes.INTEGER,
        references: { model: "Groups", key: "id" },
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["co-host", "member", "pending"]],
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Membership",
    }
  );

  return Membership;
};
