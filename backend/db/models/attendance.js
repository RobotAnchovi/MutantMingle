//*====> backend/db/models/attendance.js <====
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "event",
      });
      Attendance.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Attendance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      eventId: {
        type: DataTypes.INTEGER,
        references: { model: "Event", key: "id" },
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["attending", "waitlist", "pending"]],
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Attendance",
      tableName: "Attendances",
      timestamps: true,
    }
  );

  return Attendance;
};
