// Import Dependencies
const { DataTypes } = require('sequelize');
const { db } = require('../index.js');

// Create Schema
const Users = db.define('users', {
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fullName: { 
    type: DataTypes.STRING(80), 
    allowNull: false, 
  },
  // birdSightingsArray: {
  //   type: DataTypes.ARRAY(DataTypes.STRING),
  //   allowNull: true,
  // },
  picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  _id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  // name: { type: DataTypes.STRING(80), allowNull: false },
  // password: {Type: DataTypes.STRING, allowNull: false}, (SANTO!!!!!!)
});

// Export Schema
module.exports = {
  Users,
};
