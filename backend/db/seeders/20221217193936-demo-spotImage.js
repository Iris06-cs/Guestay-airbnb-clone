"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          url: "image1.url",
          preview: true,
          spotId: 1,
        },
        {
          url: "image2.url",
          preview: false,
          spotId: 1,
        },
        {
          url: "image3.url",
          preview: true,
          spotId: 2,
        },
        {
          url: "image4.url",
          preview: true,
          spotId: 3,
        },
        {
          url: "image5.url",
          preview: false,
          spotId: 3,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
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
