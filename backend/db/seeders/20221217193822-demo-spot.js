"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          address: "123 app st",
          city: "city1",
          state: "state1",
          country: "country1",
          lat: 37.123456,
          lng: -123.45678,
          name: "spot1",
          description: "description spot1",
          price: 123,
        },
        {
          ownerId: 1,
          address: "124 Disney Lane",
          city: "city1",
          state: "state1",
          country: "country1",
          lat: 37.789,
          lng: 123.45678,
          name: "spot2",
          description: "description spot2",
          price: 1,
        },
        {
          ownerId: 2,
          address: "456ab such st",
          city: "city2",
          state: "state2",
          country: "country2",
          lat: -12.456789,
          lng: 150.12345,
          name: "spot3",
          description: "description spot3",
          price: 123.12,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        address: {
          [Op.in]: ["123 Disney Lane", "124 Disney Lane", "456ab such st"],
        },
      },
      {}
    );
  },
};
