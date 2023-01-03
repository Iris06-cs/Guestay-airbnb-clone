"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.addIndex(options, ["lat", "lng"], {
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.removeIndex(options, ["lat", "lng"]);
  },
};
