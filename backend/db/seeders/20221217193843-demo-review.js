"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(
      options,
      [
        { userId: 1, spotId: 3, review: "Review exists", stars: 5 },
        { userId: 2, spotId: 1, review: "Review exists", stars: 4 },
        { userId: 3, spotId: 1, review: "Review exists", stars: 1 },
        { userId: 3, spotId: 2, review: "Review exists", stars: 2 },
        { userId: 2, spotId: 2, review: "Review exists", stars: 5 },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
