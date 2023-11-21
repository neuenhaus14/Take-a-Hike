// Import Dependencies
const { DataTypes } = require('sequelize');
const { db } = require('../index');
const { Users } = require('./users');

// Create Schema
const Comments = db.define('comments', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: Users, key: '_id' },
  },
  trail_id: {
    type: DataTypes.INTEGER,
  },
  comment: DataTypes.STRING,
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },

});

module.exports = {
  Comments,
};
