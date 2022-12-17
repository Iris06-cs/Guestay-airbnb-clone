"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    return queryInterface.bulkInsert(
      options,
      [
        {
          userId: 1,
          spotId: 3,
          startDate: "2022-12-18",
          endDate: "2022-12-19",
        },
        {
          userId: 2,
          spotId: 1,
          startDate: "2022-12-18",
          endDate: "2022-12-19",
        },
        {
          userId: 3,
          spotId: 3,
          startDate: "2022-12-19",
          endDate: "2022-12-21",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        userId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
