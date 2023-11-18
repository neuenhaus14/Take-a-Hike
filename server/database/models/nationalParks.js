// Import Dependencies
const { DataTypes } = require("sequelize");
const { db } = require("../index.js");

// Create Schema/Model
const NationalParks = db.define("parks", {
  _id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  latitude: {
    type: DataTypes.DECIMAL,
  },
  longitude: {
    type: DataTypes.DECIMAL,
  },
  image: { 
    type: DataTypes.STRING 
},
  parkCode: { 
    type: DataTypes.STRING(6)
},
  description: { 
    type: DataTypes.TEXT
},
  link: {
    type: DataTypes.STRING
  }
});

const NationalParkCodes = db.define("parkCodes", {
  code: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
  title: {
        type: DataTypes.STRING(85),
      },
})

// Export Schema
module.exports = {
  NationalParks,
  NationalParkCodes,
};
