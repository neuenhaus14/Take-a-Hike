const axios = require('axios');
const sequelize = require('sequelize');
const express = require('express');
const path = require('path');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const { BirdList } = require('./database/models/birdList.js');
const { BirdSightings } = require('./database/models/birdSightings.js');
const { PackingLists } = require('./database/models/packingLists');
const { PackingListItems } = require('./database/models/packingListItems');
const { joinFriends } = require('./database/models/joinFriends');
const { Comments } = require('./database/models/comments');
const { WeatherForecast } = require('./database/models/weatherForecast.js');
const { NationalParks } = require('./database/models/nationalParks.js');

// const { default: PackingList } = require("../client/components/PackingList");
const router = express.Router();

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
app.use(cors());
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
  console.log();
  WeatherForecast.create({
    userId,
    unique_id,
    avgTemp,
    highTemp,
    lowTemp,
    rain,
    condition,
    region,
    date,
  })
    .then((created) => res.status(201).send(created))
    .then((err) => console.log('Could not POST forecast', err));
});

////////////////////////////////////////EXTERNAL TRAIL API ROUTE/////////////////////////////////////////

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
      userId,
      tripId,
    },
  })
    .then((existingTrip) => {
      if (existingTrip) {
        console.log('Trip already exists!');
        res.sendStatus(409);
      } else {
        UserCreatedTrips.create({
          userId,
          tripId,
          tripName,
          tripDescription,
          beginDate,
          endDate,
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

// using the UserTrips model, create a new entry in the userTrips table

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

//get req sending bird name to sound API based off the rendered names
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

//POST for adding the bird to watch list
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

//DELETE the bird from the watch list
app.delete('/api/birdsightings/watchlist', async (req, res) => {
  try {
    const { bird_id, user_id, addToWatchlist } = req.body;
    console.log('delete req body:', req.body);

    if (addToWatchlist) {
      //Check if the entry exists
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

app.put('/update-like/:commentId', (req, res) => {
  const { commentId } = req.params;
  const { likeStatus } = req.body;

  const incrementValue = likeStatus ? 1 : -1;

  Comments.increment('likes', { by: incrementValue, where: { id: commentId } })
    .then(() => {
      const action = likeStatus ? 'added to' : 'removed from';
      console.log(`${action} likes`);
      res.sendStatus(201);
    })
    .catch((err) => console.error(err, 'added to likes went wrong'));
});

app.get('/nationalParksGetAndSave', async (req, res) => {
  try {
    const count = await NationalParks.count();
    // if (count >= 10) {
    //   await NationalParks.destroy({
    //     truncate: true,
    //     cascade: false,
    //   });
    // }
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
