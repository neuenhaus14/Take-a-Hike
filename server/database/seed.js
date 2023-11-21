const mysql = require("mysql2/promise");
const { db } = require("./index.js");
const { Trails } = require("./models/trails.js");
const { dummyParkData } = require("../../copyAPIparkData/dummyDataCopy.js");
const { dummyUserData } = require("../../copyAPIparkData/dummyUserData.js");
const { dummyFriendData } = require("../../copyAPIparkData/dummyFriendData.js");
const { dummyCommentData } = require("../../copyAPIparkData/dummyCommentData.js")
const { PackingLists } = require("./models/packingLists.js");
const { PackingListItems } = require("./models/packingListItems.js");
const { Users } = require("./models/users.js");
const { async } = require("regenerator-runtime");
const birdsOfLA = require("./data/eBirdData.js")
const { BirdList } = require("./models/birdList.js")
const { BirdSightings } = require("./models/birdSightings.js")
//import new models to seed
const { Trips, UserTrips, UserCreatedTrips } = require("./models/userTrips.js");
const { joinFriends } = require('./models/joinFriends');
const { Comments } = require('./models/comments');

db.options.logging = false;

const seedSqlize = () => {
  mysql
    .createConnection({ user: "root", password: "" })
    .then((db) =>
      db.query("CREATE DATABASE IF NOT EXISTS `TakeAHike`").then(() => db.end())
    )
    .catch(err => console.log(22, 'error', err))
    .then(() =>
      console.log(
        "\x1b[33m",
        "\nDatabase (MySQL): 'TakeAHike' successfully created!"
      )
    )
    .then(() => Users.sync())
    .then(() =>
      console.log(
        "\x1b[36m",
        "\nDatabase (MySQL): 'Users' table successfully created!"
      )
    )
    .then(() => Trips.sync())
    .then(() =>
      console.log(
        "\x1b[36m",
        "\nDatabase (MySQL): 'Trips' table successfully created!"
      )
    )
    .then(() => UserTrips.sync())
    .then(() =>
      console.log(
        "\x1b[36m",
        "\nDatabase (MySQL): 'UserTrips' table successfully created!"
      )
    )
    .then(() => UserCreatedTrips.sync())
    .then(() =>
      console.log(
        "\x1b[36m",
        "\nDatabase (MySQL): 'UserCreatedTrips' table successfully created!"
      )
    )
    .then(() => PackingLists.sync())
    .then(() =>
      console.log(
        "\x1b[36m",
        "\nDatabase (MySQL): 'PackingLists' table successfully created!"
      )
    )
    .then(() => BirdList.sync())
    .then(() =>
      console.log(
        "\x1b[36m",
        "\nDatabase (MySQL): 'BirdList' table successfully created!"
      )
    )
    .then(() => BirdSightings.sync())
    .then(() =>
      console.log(
        "\x1b[36m",
        "\nDatabase (MySQL): 'BirdSightings' table successfully created!"
      )
    )
    .then(() => {
      return PackingListItems.sync();
    })
    .then(() =>
      console.log(
        "\x1b[36m",
        "\nDatabase (MySQL): 'PackingListItems' table successfully created!"
      )
    )
    .then(() => Trails.sync())
    .then(() =>
      console.log(
        "\x1b[36m",
        "\nDatabase (MySQL): 'Trails' table successfully created!"
      )
    )
    .then(() => joinFriends.sync())
    .then(() =>
      console.log(
        "\x1b[36m",
        "\nDatabase (MySQL): 'joinFriends' table successfully created!"
      )
    )   
    .then(() => Comments.sync())
    .then(() =>
      console.log(
        "\x1b[36m",
        "\nDatabase (MySQL): 'Comments' table successfully created!"
      )
    )  
    .then(() => Promise.all(dummyUserData.map((txn) => Users.create(txn))))
    .then((arr) =>
      console.log(
        "\x1b[32m",
        `\nDatabase (MySQL): Successfully seeded users with ${arr.length} entries!\n`,
        "\x1b[37m"
      )
    ) 
    .then(() => Promise.all(dummyFriendData.map((txn) => joinFriends.create(txn))))
    .then((arr) =>
      console.log(
        "\x1b[32m",
        `\nDatabase (MySQL): Successfully seeded joinFriends with ${arr.length} entries!\n`,
        "\x1b[37m"
      )
    ) 
    .then(() => Promise.all(dummyCommentData.map((txn) => Comments.create(txn))))
    .then((arr) =>
      console.log(
        "\x1b[32m",
        `\nDatabase (MySQL): Successfully seeded comments with ${arr.length} entries!\n`,
        "\x1b[37m"
      )
    )
    .then(() => Promise.all(dummyParkData.map((txn) => Trails.create(txn))))
    .then((arr) =>
      console.log(
        "\x1b[32m",
        `\nDatabase (MySQL): Successfully seeded trails with ${arr.length} entries!\n`,
        "\x1b[37m"
      )
    )
    .then(() => Promise.all(birdsOfLA.map((bird) => BirdList.create(bird))))
    .then((arr) =>
      console.log(
        "\x1b[32m",
        `\nDatabase (MySQL): Successfully seeded birdList with ${arr.length} entries!\n`,
        "\x1b[37m"
      )
    )
    .catch(err => console.log(72, 'error', err))
    .then(process.exit);
};

seedSqlize();
