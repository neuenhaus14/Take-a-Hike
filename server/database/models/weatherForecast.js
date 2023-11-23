const { DataTypes } = require('sequelize');
const { db } = require('../index');
const { Users } = require('./users');

//weather forecast schema
const WeatherForecast = db.define('weatherForecasts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  unique_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  avgTemp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  highTemp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lowTemp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rain: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = {
  WeatherForecast,
};
