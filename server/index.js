/* eslint-disable camelcase */
/* eslint-disable object-shorthand */
const axios = require('axios');
const sequelize = require('sequelize');
const express = require('express');
const path = require('path');
const passport = require('passport');
const dotenv = require('dotenv');
const session = require('express-session');
const { BirdList } = require('./database/models/birdList.js');
const { BirdSightings } = require('./database/models/birdSightings.js');
const { PackingLists } = require('./database/models/packingLists');
const { PackingListItems } = require('./database/models/packingListItems');
const { joinFriends } = require('./database/models/joinFriends');
const { Comments } = require('./database/models/comments');
const { WeatherForecast } = require('./database/models/weatherForecast.js');
const { joinWeatherCreateTrips } = require('./database/models/joinWeatherCreateTrips.js');

const { NationalParks } = require('./database/models/nationalParks.js');

// const { default: PackingList } = require("../client/components/PackingList");
const router = express.Router();

// const session = require("express-session");
require('./middleware/auth.js');
const { cloudinary } = require('./utils/coudinary');
const { Users } = require('./database/models/users');
const { UserTrips, Trips, UserCreatedTrips } = require('./database/models/userTrips');

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// Set Distribution Path
const { PORT } = process.env;
const distPath = path.resolve(__dirname, '..', 'dist'); // serves the hmtl file of the application as default on load

// Create backend API
const app = express();

// Use Middleware
app.use(express.json()); // handles parsing content in the req.body from post/update requests
app.use(express.static(distPath)); // Statically serves up client directory
app.use(express.urlencoded({ extended: true })); // Parses url (allows arrays and objects)
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

// Reorder passport.session() to come after session()
app.use(passport.initialize());
app.use(passport.session());

// Create API Routes
const successLoginUrl = `http://localhost:${PORT}/#/trailslist`;
const errorLoginUrl = `http://localhost${PORT}/login/error`;

// Auth Routes
app.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureMessage: 'cannot log in to Google',
    failureRedirect: errorLoginUrl,
    successRedirect: successLoginUrl,
  }),
  (req, res) => {
    console.log('User: ', req.user);
    res.send('thank you for signing in!');
  },
);

// ADDING LOGOUT REQUEST HANDLER
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out', err);
    }
    req.session.destroy((error) => {
      if (error) {
        console.error('Error destroying session', error);
      }
      console.log('session user', req.user);
      res.sendStatus(200);
    });
  });
});

app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    // console.log('/profile get user', req.user)
    res.send(req.user);
  } else {
    res.send({});
  }
});

// request handler for weather api => FUNCTIONAL
app.get('/api/weather/:region/:selectDay', (req, res) => {
  const { region, selectDay } = req.params;
  console.log('DAYS', selectDay);
  axios
    .get(
      `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${region}&days=${selectDay}&aqi=no&alerts=no`,
    )
    .then(({ data }) => {
      res.send(data);
    });
});

// request handler for weatherForecasts table
app.post('/api/weatherForecasts', (req, res) => {
  const {
    userId, avgTemp, highTemp, lowTemp, condition, region, date, unique_id, rain, 
  } = req.body;
  WeatherForecast.create({
    userId: userId,
    unique_id: unique_id,
    avgTemp: avgTemp,
    highTemp: highTemp,
    lowTemp: lowTemp,
    rain: rain,
    condition: condition,
    region: region,
    date: date,
  })
    .then((created) => res.status(201).send(created))
    .then((err) => console.log('Could not POST forecast', err));
});

/// /////////////////////////////////////EXTERNAL TRAIL API ROUTE/////////////////////////////////////////

/// /////////////////////////////////////EXTERNAL TRAIL API ROUTE/////////////////////////////////////////

app.get('/api/google-maps-library', (req, res) => {
  try {
    res.send(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`,
    );
  } catch (err) {
    res.status(500).json({ error: 'Error fetching maps URL' });
    console.error('Error fetching maps URL: ', err);
  }
});

// GET req for trail data by latitude/longitude
app.get('/api/trailslist', (req, res) => {
  axios
    .get(
      `https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lat=${req.query.lat}&lon=${req.query.lon}&radius=100`,
      {
        headers: {
          'X-RapidAPI-Host': 'trailapi-trailapi.p.rapidapi.com',
          'X-RapidAPI-Key': process.env.TRAILS_API_KEY,
        },
      },
    )
    .then((response) => {
      // console.log(response.data); - returns array of objects of trail data
      res.json(response.data);
    })
    .catch((err) => {
      console.error('ERROR: ', err);
      res.sendStatus(404);
    });
});

/// ///////////////////////////////////// Cloudinary routes //////////////////////////////////////

// get request to get all images (this will later be trail specific)
app.post('/api/images', async (req, res) => {
  // console.log("server index.js || LINE 70", req.body);
  // NEED TO CHANGE ENDPOINT TO INCLUDE TRAIL SPECIFIC PARAM SO PHOTOS CAN BE UPLOADED + RENDERED PROPERLY
  try {
    // Can create new folder with upload from TrailProfile component. Need to modify get request to filter based on folder param (which will be equal to the trail name)
    const { resources } = await cloudinary.search
      .expression(
        `resource_type:image AND folder:${req.body.trailFolderName}/*`,
      )
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();

    // console.log(
    //   'SERVER INDEX.JS || CLOUDINARY GET || LINE 38 || resources ==>',
    //   resources
    // ;
    // try to filter before map
    const secureImageUrls = resources.resources
      .filter((imageObj) => imageObj.folder === req.body.trailFolderName)
      .map((image) => image.secure_url);
    res.json(secureImageUrls);
  } catch (err) {
    // console.error("error in api images post: ", err);
  }
});

/**
 * Routes saving for packing list
 */
app.post('/api/packingLists', (req, res) => {
  // console.log(req.body, "Server index.js LINE 55");
  PackingLists.create({
    listName: req.body.listName,
    packingListDescription: req.body.packingListDescription,
  })
    .then(() => {
      // console.log("LINE 63", data.dataValues);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err, 'Something went wrong');
      res.sendStatus(500);
    });
});
/**
 * Routes for packing list GET ALL LISTS
 */
app.get('/api/packingLists', (req, res) => {
  // console.log("Server index.js LINE 166", req.body);
  PackingLists.findAll()
    .then((data) => {
      // console.log("LINE 169", data);
      res.status(200).send(data);
    })
    .catch((err) => {
      console.error(err, 'Something went wrong');
      res.sendStatus(404);
    });
});

/**
 * post request to the packingListItems
 */
app.post('/api/packingListItems', (req, res) => {
  // console.log(
  //   "Is this being reached? LINE 103 SERVER.index.js || REQ.BODY \n",
  //   req.body
  // );
  PackingListItems.create()
    .then(() => {
      // console.log("from lINE 106 INDEX.js || DATA \n", data);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Failed to create FROM 113', err);
      res.sendStatus(500);
    });
});

// Routes for posting to user trips
app.post('/profile/userTrips', (req, res) => {
  // console.log("Server index.js LINE 55", req.body);
  Trips.findOne({
    where: {
      tripName: req.body.trail.name,
      tripLocation: `${req.body.trail.city}, ${req.body.trail.region}`,
    },
  }).then((existingTrip) => {
    if (existingTrip) {
      console.log('Trip already exists!');
      res.sendStatus(409);
    } else {
      Trips.create({
        tripName: req.body.trail.name,
        tripDescription: 'test description cause theya re all',
        tripLocation: `${req.body.trail.city}, ${req.body.trail.region}`,
        tripStartDate: null, //TODO:// update with user data
        tripEndDate: null, //TODO:// update with user data
        tripImage: null, //TODO:// update with user data
      })
        .then((data) => {
          console.log('Successfully created trip', data.dataValues, 'user id', req.body);
          UserTrips.create({
            userId: req.body.userId,
            tripId: req.body.trail.id,
            tripName: req.body.trail.name,
            tripDescription: 'test description cause theya re all',
            tripLocation: `${req.body.trail.city}, ${req.body.trail.region}`,
            tripRating: req.body.trail.rating,
          })
            .then((data) => {
              // console.log("LINE 63", data.dataValues);
              res.sendStatus(201);
            })
            .catch((err) => {
              console.error(err, 'Something went wrong');
              res.sendStatus(500);
            });
        })
        .catch((err) => {
          console.error(err, 'Something went wrong');
          res.sendStatus(500);
        });
    }
  });
});

app.get('/profile/userTrips/:userId', (req, res) => {
  console.log('Request user trips:', req.user);
  console.log('request user trips: params', req.params);
  const { _id } = req.user;

  UserTrips.findAll({
    where: {
      userId: _id,
    },
  })
    .then((userTrips) => {
      // console.log('User trips:', userTrips);
      res.json(userTrips);
    })
    .catch((err) => {
      console.error('ERROR: ', err);
      res.sendStatus(404);
    });
});
//post req for usercreated trips
app.post('/api/createTrip', (req, res) => {
  console.log('createTrip req.body', req.body);
  const {
    userId, tripId, tripName, tripDescription, beginDate, endDate, 
  } = req.body;
  console.log('userId', userId);
  // first check to see if the usercreated trip exists
  UserCreatedTrips.findOne({
    where: {
      userId: userId,
      tripId: tripId,
    },
  })
    .then((existingTrip) => {
      if (existingTrip) {
        console.log('Trip already exists!');
        res.sendStatus(409);
      } else {
        UserCreatedTrips.create({
          userId: userId,
          tripId: tripId,
          tripName: tripName,
          tripDescription: tripDescription,
          beginDate: beginDate,
          endDate: endDate,
        })
          .then((data) => {
            console.log('Successfully created trip', data.dataValues);
            res.sendStatus(201);
          })
          .catch((err) => {
            console.error(err, 'Something went wrong');
            res.sendStatus(500);
          });
      }
    })
    .catch((err) => {
      console.error(err, 'Something went wrong');
      res.sendStatus(500);
    });
});
// get request for all user created trips
app.get('/profile/userCreatedTrips/:userId', (req, res) => {
  const { userId } = req.params;

  UserCreatedTrips.findAll({
    where: {
      userId: userId,
    },
  })
    .then((userTrips) => {
      // console.log('User trips:', userTrips);
      res.json(userTrips);
    })
    .catch((err) => {
      console.error('ERROR: ', err);
      res.sendStatus(404);
    });
});
//get request for searching specific saved trips
app.get('/profile/savedTrips/:selectedTripId', (req, res) => {
  const { selectedTripId } = req.params;
  console.log('selected trip from abackended', selectedTripId);
  UserTrips.findOne({ where: { tripId: selectedTripId } })
    .then((fetchedTrip) => {
      console.log('successfully fetched saved trip from db');
      res.status(201).send(fetchedTrip);
    })
    .catch((err) => console.error('failed to fetch saved trip from db', err));
});
// get request for searching specific userCreated trips 
app.get('/profile/savedUserCreatedTrips/:selectedTripId', (req, res) => {
  const { selectedTripId } = req.params;
  console.log('selected trip from abackended', selectedTripId);
  UserCreatedTrips.findOne({ where: { tripId: selectedTripId } })
    .then((fetchedTrip) => {
      console.log('successfully fetched saved trip from db');
      res.status(201).send(fetchedTrip);
    })
    .catch((err) => console.error('failed to fetch saved trip from db', err));
});

////////////////// REQUEST HANDLERS WORKING IN WEATHER COMPONENT ///////////////

// GET all of the logged in user's trips (for weather component)
app.get('/api/createTrip/:userId', (req, res) => {
  const { userId } = req.params;
  UserCreatedTrips.findAll({ where: { userId: userId } })
    .then((response) => {
      res.status(200);
      res.send(response);
    })
    .catch((err) => console.error(err));
});

// POST the weather forecast id and user id to joinWeatherCreateTable
app.post('/api/joinWeatherCreateTrips', (req, res) => {
  const {
    userId, tripId, unique_id, weatherId, 
  } = req.body;
  console.log(req.body);
  // userId and tripId and unique_id
  joinWeatherCreateTrips.findOne({
    where: {
      userId: userId, tripId: tripId, unique_id: unique_id, weatherId: weatherId, 
    }, 
  })
    .then((found) => {
      if (!found) {
        joinWeatherCreateTrips.create({
          userId: userId,
          tripId: tripId,
          unique_id: unique_id,
          weatherId: weatherId,
        })
          .then((results) => res.status(201).send(results))
          .catch((err) => console.error(err));
      }
    })
    .catch((err) => console.error(err));
});

//get request for the joinWeatherCreateTrips table to get the unique id
app.get('/api/joinedWeatherCreateTrips/:userId/:tripId', (req, res) => {
  const { userId, tripId } = req.params;
  joinWeatherCreateTrips.findAll({ where: { userId: userId, tripId: tripId } })
    .then((response) => {
      res.status(200);
      res.send(response);
    })
    .catch((err) => console.error(err));
});

//get request for weather forecast data related to the trip
app.get('/api/weatherForecast/:unique_id', (req, res) => {
  const { unique_id } = req.params;
  WeatherForecast.findAll({ where: { unique_id: unique_id }, order: [['date', 'ASC']] })
    .then((response) => {
      res.status(200);
      res.send(response);
    })
    .catch((err) => console.error(err));
});

/// ////////////////////////////////////////////////////////////////////////////

/// ///////////////////////////////////////////////////////////Bird Sightings

/// ///////////////////////////////////////////////////////////Bird List Routes

// GET req for all birdList data

app.get('/api/birdList', async (req, res) => {
  // console.log("Request user bird:", req.user);
  try {
    const stateCode = req.query.state || 'LA';
    const apiUrl = `https://api.ebird.org/v2/data/obs/US-${stateCode}/recent`;

    const response = await axios.get(apiUrl, {
      headers: {
        'X-eBirdApiToken': process.env.X_EBIRD_API_KEY,
      },
    });

    const birdList = response.data.map((observation) => ({
      scientificName: observation.sciName,
      commonName: observation.comName,
      location: observation.locName,
      totalObserved: observation.howMany,
      observationDate: observation.obsDt,
    }));

    res.json(birdList);
  } catch (err) {
    console.error('ERROR:', err);
    res.sendStatus(500);
  }
});

// get req sending bird name to sound API based off the rendered names
app.get('/api/birdsounds/:birdName', async (req, res) => {
  try {
    const { birdName } = req.params;
    const soundApiUrl = `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(
      birdName,
    )}`;

    const soundResponse = await axios.get(soundApiUrl);
    const birdSounds = soundResponse.data.recordings;

    res.json({ birdSounds });
  } catch (error) {
    console.error('Error fetching bird sounds:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET req for filtered birdList data based on search query
app.get('/api/birdList/search', async (req, res) => {
  try {
    const stateCode = req.query.state || 'LA';
    const searchQuery = req.query.search || ''; // Get the search query from the request

    const apiUrl = `https://api.ebird.org/v2/data/obs/US-${stateCode}/recent`;

    const response = await axios.get(apiUrl, {
      headers: {
        'X-eBirdApiToken': process.env.X_EBIRD_API_KEY,
      },
    });

    const birdList = response.data.map((observation) => ({
      scientificName: observation.sciName,
      commonName: observation.comName,
      location: observation.locName,
      totalObserved: observation.howMany,
      observationDate: observation.obsDt,
    }));

    // Filter the bird list based on the search query
    const filteredBirdList = birdList.filter(
      (bird) => bird.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
        || bird.commonName.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    res.json(filteredBirdList);
  } catch (err) {
    console.error('ERROR:', err);
    res.sendStatus(500);
  }
});

//GET req for wiki link for all rendered bird names
app.get('/api/wiki/:birdName', async (req, res) => {
  try {
    const { birdName } = req.params;
    const wikiApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=info&inprop=url&titles=${encodeURIComponent(
      birdName,
    )}`;
    const response = await axios.get(wikiApiUrl);
    const { pages } = response.data.query;

    const scientificUrl = Object.values(pages)
      .map((page) => page.fullurl)
      .find((url) => url);

    const wikiDetails = {
      scientificUrl: scientificUrl || null,
    };

    res.json(wikiDetails);
  } catch (error) {
    console.error('Error fetching Wikipedia details:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////Bird Sightings Routes

//GET for checking the watchlist
app.get('/api/birdsightings/watchlist', async (req, res) => {
  try {
    const { bird_id, user_id } = req.query;

    const existingEntry = await BirdSightings.findOne({
      where: {
        bird_id,
        user_id,
      },
    });

    res.status(200).json({ inWatchlist: !!existingEntry });
  } catch (error) {
    console.error('Error checking watchlist:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST for adding the bird to watch list
app.post('/api/birdsightings/watchlist', async (req, res) => {
  try {
    const { bird_id, user_id, addToWatchlist } = req.body;
    console.log('bird sightings:', req.body);

    await BirdSightings.create({
      bird_id,
      user_id,
      inWatchlist: addToWatchlist,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating watchlist:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE the bird from the watch list
app.delete('/api/birdsightings/watchlist', async (req, res) => {
  try {
    const { bird_id, user_id, addToWatchlist } = req.body;
    console.log('delete req body:', req.body);

    if (addToWatchlist) {
      // Check if the entry exists
      const existingEntry = await BirdSightings.findOne({
        where: {
          bird_id,
          user_id,
        },
      });

      if (!existingEntry) {
        await BirdSightings.create({
          bird_id,
          user_id,
          inWatchlist: true,
        });
      }
    } else {
      // Remove from watchlist logic
      await BirdSightings.destroy({
        where: {
          bird_id,
          user_id,
        },
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating watchlist:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET req for all birdSightings data
app.get('/api/birdsightings', (req, res) => {
  BirdSightings.findAll()
    .then((birdSightings) => {
      res.json(birdSightings);
    })
    .catch((err) => {
      console.error('ERROR: ', err);
      res.sendStatus(404);
    });
});

// POST req to birdSightings database
app.post('/api/birdsightings', (req, res) => {
  // console.log('Line 231 - Back End Bird Sightings Post Request: ', req.body);
  BirdSightings.create({
    // bird_id: req.body.bird_id,
    user_id: req.body.user_id,
  })
    .then(() => {
      // console.log("LINE 220", data);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err, 'Something went wrong');
      res.sendStatus(500);
    });
});

// Delete req to birdSightings database
app.delete('/api/birdsightings', (req, res) => {
  // console.log('Line 231 - Back End Bird Sightings Delete Request: ', req.body);
  BirdSightings.delete({
    bird_id: req.body.bird_id,
    user_id: req.body.user_id,
  })
    .then(() => {
      // console.log("LINE 220", data);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err, 'Something went wrong');
      res.sendStatus(500);
    });
});

app.post('/search-friends', (req, res) => {
  const { fullName } = req.body.options;

  Users.findAll({ where: { fullName } })
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.put('/add-friends/:userId', (req, res) => {
  const { userId } = req.params;
  const { friend_user_id } = req.body.options;

  joinFriends
    .create({
      friending_user_id: userId,
      friend_user_id,
    })
    .then(() => {
      res.status(200).send('You are now following the user');
    })
    .catch((err) => {
      console.error('Error following user:', err);
      res.status(500).send('Error following user');
    });
});

app.delete('/delete-friends/:userId/:friendId', (req, res) => {
  const { userId } = req.params;
  const { friendId } = req.params;

  joinFriends
    .destroy({
      where: {
        friending_user_id: userId,
        friend_user_id: friendId,
      },
    })
    .then(() => {
      console.log('destoryed');
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Could not DELETE friend', err);
      res.sendStatus(500);
    });
});

app.get('/friends-list/:user_id', (req, res) => {
  const { user_id } = req.params;

  joinFriends
    .findAll({ where: { friending_user_id: user_id } })
    .then((friends) => {
      const friend = friends.map((fren) => fren.friend_user_id);
      Users.findAll({ where: { _id: friend } })
        .then((foundFriend) => {
          // const friendName = foundFriend.map((name) => name.fullName)
          // console.log('friendName', friendName)
          // res.status(200).send(friendName);
          res.status(200).send(foundFriend);
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(404);
        });
    })
    .catch((err) => {
      console.error('Could not GET questions by user_id', err);
      res.sendStatus(500);
    });
});

app.post('/add-comment', async (req, res) => {
  try {
    const { user_id } = req.body.options;
    const { trail_id } = req.body.options;
    const { comment } = req.body.options;

    const trailComment = await Comments.create({ user_id, trail_id, comment });
    const user = await Users.findOne({ where: { _id: trailComment.user_id } });

    if (user) {
      trailComment.dataValues.username = user.dataValues.email;
      res.status(200).send([trailComment]);
    }
  } catch (err) {
    console.error(err, 'Something went wrong with getting comments');
    res.sendStatus(500);
  }
});

app.get('/comments-by-trail/:trail_id', async (req, res) => {
  try {
    const { trail_id } = req.params;
    const trailComments = await Comments.findAll({ where: { trail_id } }); // getting us all trails

    await Promise.all(trailComments.map(async (trailComment) => {
      try {
        const user = await Users.findOne({ where: { _id: trailComment.user_id } });
        if (user) {
          trailComment.dataValues.username = user.dataValues.email;
        }
      } catch (err) {
        console.error(err, 'something went wrong w getting user');
      }
    }));

    res.status(200).send(trailComments.reverse());
  } catch (err) {
    console.error(err, 'Something went wrong with getting comments');
    res.sendStatus(500);
  }
});

app.delete('/delete-comment/:user_id/:id/:trail_id', (req, res) => {
  const { user_id } = req.params;
  const { id } = req.params;
  const { trail_id } = req.params;

  Comments.destroy({
    where: {
      user_id,
      id,
      trail_id,
    },
  })
    .then((response) => {
      console.log('deleted comment', response);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Could not DELETE comment', err);
      res.sendStatus(500);
    });
});

app.put('/update-like/:commentId/:userId', (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.params;
  // const { likeStatus } = req.body;

  Likes.findOne({ where: { user_id: userId, comment_id: commentId } })
    .then((likeEntry) => {
      if (!likeEntry) {
        Likes.create({
          user_id: userId,
          comment_id: commentId,
          like: true,
        })
          .then(() => {
            Likes.findAll({ where: { comment_id: commentId, like: true } })
              .then((comments) => {
                console.log('comments in first', comments);
                Comments.update({ likes: comments.length }, { where: { id: commentId } })
                  .then(() => {
                    console.log('success');
                    res.sendStatus(200);
                  })
                  .catch((error) => {
                    console.error('Error updating comment:', error);
                    res.status(500).send('Internal Server Error');
                  });
              })
              .catch((error) => {
                console.error('Error getting likes:', error);
                res.status(500).send('Internal Server Error');
              });
          })
          .catch(() => {
            console.log('not successfully created');
            res.sendStatus(404);
          });
      } else {
        console.log(likeEntry);
        Likes.update({ like: !likeEntry.like }, { where: { user_id: userId, comment_id: commentId } })
          .then(() => {
            Likes.findAll({ where: { comment_id: commentId, like: true } })
              .then((comments) => {
                console.log('comments in second', comments);
                Comments.update({ likes: comments.length }, { where: { id: commentId } })
                  .then(() => {
                    console.log('success');
                    res.sendStatus(200);
                  })
                  .catch((error) => {
                    console.error('Error updating comment:', error);
                    res.status(500).send('Internal Server Error');
                  });
              })
              .catch((error) => {
                console.error('Error getting likes:', error);
                res.status(500).send('Internal Server Error');
              });
          })
          .catch(() => {
            console.log('not successfully updated');
            res.sendStatus(404);
          });
      }
    })
    .catch((err) => console.error(err, 'added to likes went wrong'));
});

app.get('/nationalParksGetAndSave', async (req, res) => {
  try {
    const count = await NationalParks.count();
    if (count < 1) {
      const response = await axios.get(
        `https://developer.nps.gov/api/v1/places?q=hiking&limit=1840&api_key=${process.env.NATIONAL_PARKS_API_KEY}`,
      );
      const unfilteredData = response.data.data;
      const mappedParkData = unfilteredData
        .filter((item) => (item.tags 
        && item.tags.some((tag) => tag.toLowerCase() === 'trailhead')) 
        || (item.amenities 
        && item.amenities.some((amenity) => amenity.toLowerCase() === 'trailhead')))
        .filter((item) => item.relatedParks?.[0]?.parkCode)
        .map((item) => ({
          title: item.title,
          latitude: item.latitude || null,
          longitude: item.longitude || null,
          image: item.images[0].url || null,
          parkCode: item.relatedParks[0].parkCode || null,
          description: item.bodyText || null,
          link: item.url || null,
        }));
        
      await NationalParks.bulkCreate(mappedParkData);
      console.log('Parks data successfully saved to database');
  
      res.sendStatus(200);
    }
  } catch (err) {
    console.error('error fetching and saving parks', err);
    res.sendStatus(500);
  }
});

app.get('/parksInRadius', async (req, res) => {
  const { lat, long } = req.query;
  console.log('lat, long', lat, long);
  const radius = 100;
  const haversine = `(3959 * acos(
    cos(radians(${lat})) * cos(radians(latitude)) *
    cos(radians(longitude) - radians(${long})) + sin (radians(${lat})) * 
      sin(radians(latitude))
  ))`;
  try {
    const parksInRadius = await NationalParks.findAll({
      attributes: {
        include: [
          [sequelize.literal(haversine), 'distance'],
          [sequelize.literal('(SELECT title FROM park_codes WHERE park_codes.code = parks.parkCode)'), 'parkTitle'],
        ],
      },
      where: sequelize.where(sequelize.literal(haversine), '<=', radius),
      order: sequelize.literal('distance'),
    });
    res.send(parksInRadius);
  } catch (err) {
    console.error('error finding parks in radius: ', err);
    res.sendStatus(500);
  }
});

// launches the server from localhost on port 5555
app.listen(PORT, () => {
  console.log(`
  Listening at: http://localhost:${PORT}
  `);
});
