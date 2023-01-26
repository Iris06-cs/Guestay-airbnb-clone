"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.addIndex(options, ["userId", "spotId"], {
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.removeIndex(options, ["userId", "spotId"]);
  },
};
