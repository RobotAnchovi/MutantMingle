//*====> backend/db/models/user.js <====
"use strict";
const { Model, Validator } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Membership, {
        foreignKey: "userId",
        as: "memberships",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Attendance, {
        foreignKey: "userId",
        as: "attendances",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Group, {
        foreignKey: "organizerId",
        as: "organizerGroups",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
          len: [1, 30],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
          len: [1, 30],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"],
        },
      },
    }
  );
  return User;
};
