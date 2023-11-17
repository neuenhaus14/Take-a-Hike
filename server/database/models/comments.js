// Import Dependencies
const { DataTypes } = require("sequelize");
const { db } = require("../index.js");
const { Users } = require("./users.js");

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
  likes: DataTypes.INTEGER, 

  
});

module.exports = {
  Comments,
};