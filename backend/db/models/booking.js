"use strict";
const { Model, Validator } = require("sequelize");
// const getYesterday = () => {
//   const today = new Date();
//   const yesterday = new Date(today.setDate(today.getDate() - 1));
//   const year = yesterday.getFullYear();
//   const month = yesterday.getMonth() + 1;
//   const day = yesterday.getDate();
//   return `${year}-${month}-${day}`;
// };

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // 1-many users-bookings
      Booking.belongsTo(models.User, { foreignKey: "userId" });
      //1-many spots-bookings
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });
    }
  }
  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },

        unique: true,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          // isDateString(val) {
          //   if (
          //     !Validator.isDate(val, { format: "YYYY-MM-DD", strictMode: true })
          //   )
          //     throw Error("Not a valid date format");
          // },
          isDate: true,
          // isAfter: this.startDate,
        },

        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
