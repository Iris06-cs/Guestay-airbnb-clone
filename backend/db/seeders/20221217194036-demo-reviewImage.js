"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          url: "image1.url",
          reviewId: 1,
        },
        {
          url: "image2.url",
          reviewId: 1,
        },
        {
          url: "image3.url",
          reviewId: 2,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: { [Op.in]: ["image1.url", "image2.url", "image3.url"] },
      },
      {}
    );
  },
};
