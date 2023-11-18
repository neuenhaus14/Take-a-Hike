const { DataTypes } = require('sequelize');
const { db } = require('../index.js');
const { Users } = require('./users.js');

//weather forecast schema
const WeatherForecast = db.define('weatherForecasts', {
  _id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  avgTemp: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  highTemp: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  lowTemp: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  rain: {
    type: DataTypes.INTEGER,
    allowNull: true},
  condition: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = {
  WeatherForecast
}