"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      //1-many reviews-reviewImages
      ReviewImage.belongsTo(models.Review, {
        foreignKey: "reviewId",
        // onDelete: "CASCADE",
      });
    }
  }
  ReviewImage.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ReviewImage",
    }
  );
  return ReviewImage;
};
