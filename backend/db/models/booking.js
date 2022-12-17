"use strict";
const { Model } = require("sequelize");
const getYesterday = () => {
  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));
  const year = yesterday.getFullYear();
  const month = yesterday.getMonth() + 1;
  const day = yesterday.getDate();
  return `${year}-${month}-${day}`;
};

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 1-many users-bookings
      Booking.belongsTo(models.User, { foreignKey: "userId" });
      //1-many spots-bookings
      Booking.belongsTo(models.Spot, { foreignKey: "spotId" });
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
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          //on or after today
          isAfter: getYesterday(),
        },
        unique: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isAfter: this.startDate,
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
