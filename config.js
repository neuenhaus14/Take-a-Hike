const dotenv = require('dotenv');
dotenv.config();

const {TRAILS_API_KEY, GOOGLE_MAPS_API_KEY} = process.env;

module.exports ={
    TRAILS_API_KEY, GOOGLE_MAPS_API_KEY,
}