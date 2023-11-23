const { DataTypes } = require('sequelize');
const { db } = require('../index');
const { Users } = require('./users');
const { UserCreatedTrips } = require('./userTrips');

const joinWeatherCreateTrips = db.define('joinWeatherCreateTrips', {
  userId: {
    type: DataTypes.INTEGER,
    references: { model: Users, key: '_id' },
  },
  tripId: {
    type: DataTypes.INTEGER,
    references: { model: UserCreatedTrips, key: 'id' },
  },
  unique_id: {
    type: DataTypes.INTEGER,
  },
});

module.exports = {
  joinWeatherCreateTrips,
};