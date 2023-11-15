//todo 
// first i need to create a new project in google developers console
// then i will be given a client ID and client secret which must be provided to passport
// then i will need to configure a redirect URI with matches the rout in our application.
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ENVIRONMENT } = process.env;
let callbackURL = 'http://localhost:5555/auth/google/callback';
passport.use(new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL,
    passReqToCallback: true,
  },
  ((request, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }),
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});