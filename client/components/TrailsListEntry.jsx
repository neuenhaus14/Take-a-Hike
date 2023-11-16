import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const handleAddTrail = (trail) => {
  axios.post('/profile/userTrips', trail)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.error('ERROR: ', err);
    });
};

const TrailsListEntry = ({ trail }) => {
  return (
    // <Link to={`/trailprofile/${trail.id}`}>
      <div className="profile-card">
        <div className="list-item-card">
          <img src={trail.thumbnail} />
          <h3>{trail.name}</h3>
          <div className="info-group">
            <p>City: {trail.city}</p>
          </div>
          <div className="info-group">
            <p>State: {trail.region}</p>
          </div>
          <div className="info-group">
            <p>Rating: {trail.rating}</p>
          </div>
          <div className="button">
            <button type='button' value={trail} onClick={() => {handleAddTrail(trail)}}>Add Trail to user trails</button>
          </div>
        </div>
      </div>
    // </Link>
  );
};

export default TrailsListEntry
