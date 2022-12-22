// backend/config/database.js
const config = require("./index");

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    seederStorage: "sequelize",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: function (field, next) {
        // for reading from database
        if (field.type === "DATEONLY") {
          return field.string();
        }
        return next();
      },
    },
    define: {
      schema: process.env.SCHEMA,
    },
  },
};
