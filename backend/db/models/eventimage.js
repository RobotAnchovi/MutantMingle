//*====> backend/db/models/eventimage.js <====
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    static associate(models) {
      //^ Associations
      EventImage.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "event",
      });
    }
  }

  EventImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      eventId: {
        type: DataTypes.INTEGER,
        references: { model: "Events", key: "id" },
        allowNull: false,
      },
      url: DataTypes.STRING,
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "EventImage",
    }
  );

  return EventImage;
};
