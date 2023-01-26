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
          startDate: "2023-12-18",
          endDate: "2023-12-19",
        },
        //past booking
        {
          userId: 1,
          spotId: 3,
          startDate: "2021-11-15",
          endDate: "2021-11-20",
        },
        {
          userId: 2,
          spotId: 1,
          startDate: "2023-12-18",
          endDate: "2023-12-19",
        },
        //past booking
        {
          userId: 2,
          spotId: 1,
          startDate: "2019-02-06",
          endDate: "2019-02-12",
        },
        {
          userId: 3,
          spotId: 3,
          startDate: "2023-12-19",
          endDate: "2023-12-21",
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
