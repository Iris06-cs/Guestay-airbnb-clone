"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("Spots", ["lat", "lng"], {
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Spots", ["lat", "lng"]);
  },
};
