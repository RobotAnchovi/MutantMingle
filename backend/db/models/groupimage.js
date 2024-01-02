//*====> backend/db/models/groupimage.js <====
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    static associate(models) {
      //^ Associations
      GroupImage.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "group",
      });
    }
  }

  GroupImage.init(
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
      modelName: "GroupImage",
    }
  );

  return GroupImage;
};
