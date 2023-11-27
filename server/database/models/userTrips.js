const { DataTypes } = require('sequelize');
const { db } = require('../index.js');
const { Users } = require('./users.js');

//Create a trips table
const Trips = db.define('trips', {
  tripName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tripDescription: {
    allowNull: true,
    type: DataTypes.TEXT, //changed to .text to accomodate longer strings pls work -dan
  },
  tripLocation: {
    type: DataTypes.STRING,
    allowNull: true, //TODO: change to false? maybe
  },
  tripStartDate: {
    type: DataTypes.DATE,
    allowNull: true, //TODO: change to false? maybe
  },
  tripEndDate: {
    type: DataTypes.DATE,
    allowNull: true, //TODO: change to false? maybe
  },
  tripImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
});
//Create a userTrips table
//this table is the join table for users and trips
const UserTrips = db.define('userTrips', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  // it takes the userId and tripId from the users and trips tables
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tripName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tripDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tripLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tripRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
//need a table for user created trips
const UserCreatedTrips = db.define('userCreatedTrips', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tripName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tripDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tripLocation: { 
    type: DataTypes.STRING,
    allowNull: true,
  },
  tripRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  beginDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = {
  Trips,
  UserTrips,
  UserCreatedTrips,
};