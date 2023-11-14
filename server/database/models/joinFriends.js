// Import Dependencies
const { DataTypes } = require("sequelize");
const { db } = require("../index.js");
const { Users } = require("./users.js");

// Create Schema
const joinFriends = db.define('joinFriends', {
  friending_user_id: {
    type: DataTypes.INTEGER, 
    references: { model: Users, key: '_id' }, 
  },
  friend_user_id: {
    type: DataTypes.INTEGER, 
    references: { model: Users, key: '_id' }, 
  },
}, { timesstamps: true });

module.exports = {
  joinFriends,
};