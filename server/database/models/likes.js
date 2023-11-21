const { DataTypes } = require('sequelize');
const { db } = require('../index');
const { Users } = require('./users');
const { Comments } = require('./comments');

// Create Schema
const Likes = db.define('likes', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: Users, key: '_id' },
  },
  comment_id: {
    type: DataTypes.INTEGER,
    references: { model: Comments, key: 'id' },
  },
  like: DataTypes.BOOLEAN,

});

module.exports = {
  Likes,
};
