"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          url: "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fEludGVyaW9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
          preview: true,
          spotId: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1487798452839-c748a707a6b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fEludGVyaW9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
          preview: false,
          spotId: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8SW50ZXJpb3J8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60",
          preview: true,
          spotId: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fEludGVyaW9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
          preview: true,
          spotId: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fEludGVyaW9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
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
        url: {
          [Op.in]: [
            "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fEludGVyaW9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
            "https://images.unsplash.com/photo-1487798452839-c748a707a6b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fEludGVyaW9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
            "https://images.unsplash.com/photo-1564078516393-cf04bd966897?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8SW50ZXJpb3J8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60",
            "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fEludGVyaW9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
            "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fEludGVyaW9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
          ],
        },
      },
      {}
    );
  },
};
