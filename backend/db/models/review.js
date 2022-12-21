"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1-many users-reviews
      Review.belongsTo(models.User, { foreignKey: "userId" });
      //1-many spots-reviews
      Review.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
      //1-many reviews-reviewImages
      Review.hasMany(models.ReviewImage, { foreignKey: "reviewId" });
    }
  }
  Review.init(
    {
      // userId: DataTypes.INTEGER,
      // spotId: DataTypes.INTEGER,
      // review: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        //keep user review even after the user account deleted to make the review truthful
        allowNull: true,
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 255],
        },
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
      // indexes: [
      //   {
      //     unique: true,
      //     fields: ["userId", "spotId"],
      //   },
      // ],
    }
  );
  return Review;
};
