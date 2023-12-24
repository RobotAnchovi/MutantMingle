//*====> backend/db/models/venue.js <====
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      // define association here
      Venue.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "group",
      });
    }
  }

  Venue.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.INTEGER,
        references: { model: "Groups", key: "id" },
        allowNull: false,
      },
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      lat: DataTypes.DECIMAL,
      lng: DataTypes.DECIMAL,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Venue",
    }
  );

  return Venue;
};
