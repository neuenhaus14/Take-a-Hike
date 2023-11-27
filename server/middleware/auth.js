//todo
// first i need to create a new project in google developers console
// then i will be given a client ID and client secret which must be provided to passport
// then i will need to configure a redirect URI with matches the rout in our application.

require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Users } = require('../database/models/users.js');

const { PORT } = process.env;

if (process.env.ENV === 'prod') {
  var HOST = 'ec2-18-217-195-221.us-east-2.compute.amazonaws.com';
} else {
  var HOST = 'localhost';
}
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://${HOST}:${PORT}/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const defaultUser = {
        fullName: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
        googleId: profile.id,
      };
      Users.findOrCreate({
        where: { googleId: profile.id },
        defaults: defaultUser,
      })
        .then(([user, created]) => {
          if (!created && !user) {
            console.log('User not found');
            return done(null, false);
          }
          console.log('User added to database');
          return done(null, user);
        })
        .catch((err) => {
          console.error('Error logging on', err);
          return done(err);
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
