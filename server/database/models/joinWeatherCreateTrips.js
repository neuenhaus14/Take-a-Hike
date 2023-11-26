const { DataTypes } = require('sequelize');
const { db } = require('../index');
const { Users } = require('./users');
const { UserCreatedTrips } = require('./userTrips');

const joinWeatherCreateTrips = db.define('joinWeatherCreateTrips', {
  userId: {
    type: DataTypes.INTEGER,
  },
  tripId: {
    type: DataTypes.INTEGER,
  },
  unique_id: {
    type: DataTypes.INTEGER,
  },
  weatherId: {
    type: DataTypes.INTEGER,
  },
});

module.exports = {
  joinWeatherCreateTrips,
};