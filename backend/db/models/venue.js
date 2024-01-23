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
      Venue.hasMany(models.Event, {
        foreignKey: "venueId",
        as: "events",
        onDelete: "CASCADE",
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
      address: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      state: { type: DataTypes.STRING, allowNull: false },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Venue",
      tableName: "Venues",
      timestamps: true,
    }
  );

  return Venue;
};
