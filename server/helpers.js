const axios = require("axios");
const config = require("../config");

const getMapsURL = () =>{
    return `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_API_KEY}&libraries=places`
} 

module.exports.getMapsURL = getMapsURL