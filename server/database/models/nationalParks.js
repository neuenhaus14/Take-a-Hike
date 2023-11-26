// Import Dependencies
const { DataTypes } = require('sequelize');
const { db } = require('../index');

// Create Schema/Model
const NationalParkCodes = db.define('park_codes', {
  code: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(85),
  },
});

const NationalParks = db.define('parks', {
  _id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
  },
  image: { 
    type: DataTypes.STRING, 
  },
  parkCode: { 
    type: DataTypes.STRING(6),
    references: {
      model: NationalParkCodes,
      key: 'code',
    },
  },
  description: { 
    type: DataTypes.TEXT,
  },
  link: {
    type: DataTypes.STRING,
  },
});
NationalParks.belongsTo(NationalParkCodes, { foreignKey: 'parkCode' });
// Export Schema
module.exports = {
  NationalParks,
  NationalParkCodes,
};
