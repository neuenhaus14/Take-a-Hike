// Import Dependencies
const { DataTypes } = require('sequelize');
const { db } = require('../index.js');
//DONT LOOK AT THIS
// Create Schema
const BirdList = db.define('birdList', {
  _id: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
  scientificName: {type: DataTypes.STRING, allowNull: false},
  commonName: {type: DataTypes.STRING, allowNull: false},
  commonFamilyName: {type: DataTypes.STRING, allowNull: false},
  scientificFamilyName: {type: DataTypes.STRING, allowNull: false},
  order: {type: DataTypes.STRING, allowNull: false},
  category: {type: DataTypes.STRING, allowNull: false},
 });

 // Export Schema
 module.exports = {
  BirdList,
 }