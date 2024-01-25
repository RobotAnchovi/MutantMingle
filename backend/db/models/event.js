//*====> backend/db/models/event.js <====
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
        as: "eventImages",
        onDelete: "CASCADE",
      });
      Event.hasMany(models.Attendance, {
        foreignKey: "eventId",
        as: "attendances",
        onDelete: "CASCADE",
      });
      Event.belongsTo(models.Venue, { foreignKey: "venueId", as: "venue" });
      Event.belongsTo(models.Group, { foreignKey: "groupId", as: "group" });
    }
  }

  Event.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      venueId: {
        type: DataTypes.INTEGER,
        references: { model: "Venue", key: "id" },
        allowNull: true,
      },
      groupId: {
        type: DataTypes.INTEGER,
        references: { model: "Groups", key: "id" },
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["Online", "In person"]],
        },
      },
      capacity: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Event",
      tableName: "Events",
      timestamps: true,
    }
  );

  return Event;
};
