const { DataTypes } = require("sequelize");
const { db } = require("../index.js");

const joinWeatherCreateTrips = db.define('joinWeatherCreateTrips', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

module.exports = {
  joinWeatherCreateTrips
};