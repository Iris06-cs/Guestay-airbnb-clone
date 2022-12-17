"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Reviews",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          //keep user review even after the user account deleted to make the review truthful
          allowNull: true,
          references: {
            model: "Users",
            key: "id",
          },
        },
        spotId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Spots",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        review: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        stars: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
    await queryInterface.addIndex(options, ["userId", "spotId"], {
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.removeIndex(options, ["userId", "spotId"]);
    return await queryInterface.dropTable(options);
  },
};
