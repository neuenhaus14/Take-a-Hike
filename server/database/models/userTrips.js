const { DataTypes } = require("sequelize");
const { db } = require("../index.js");
const { Users } = require("./users.js");

//Create a trips table
const Trips = db.define("trips", {
    tripName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tripDescription: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tripLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tripStartDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tripEndDate: {
        type: DataTypes.STRING,
        allowNull: false,
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
    const UserTrips = db.define("userTrips", {
        // it takes the userId and tripId from the users and trips tables
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        tripId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    });
    //here, we define associations between the users and trips tables through the userTrips table
    Users.belongsToMany(Trips, {through: UserTrips, foreignKey: "userId"});
    Trips.belongsToMany(Users, {through: UserTrips, foreignKey: "tripId"});

    module.exports = {
        Trips,
        UserTrips,
    }