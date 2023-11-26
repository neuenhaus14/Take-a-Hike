import React, { useState, useEffect } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import Comments from './Comments.jsx';
import NavBar from './NavBar.jsx';

const TrailProfile = ({ trailList }) => {
  const userData = useLoaderData();
  const userId = userData._id;

  const { id } = useParams();
  const displayTrail = trailList.find((trail) => trail.id == id);
  const trailId = parseInt(id);

  return (
    <div>
      <NavBar />
      <div className="trails">
        <figure className="profile-card">
          <img src={`${displayTrail.thumbnail}`} alt={displayTrail.id} />
          <div className="post__header">
            <h1>{displayTrail.name}</h1>
          </div>
          <div className="post__header">
            <h2 className="profile-card">
              {displayTrail.city}, {displayTrail.region}
            </h2>
          </div>
          <p className="post__header">{displayTrail.description}</p>
          <p className="post__header">{displayTrail.directions}</p>
          <div className="post__header__2">
            <div>Difficulty Level: {displayTrail.difficulty}</div>
            <div>Features: {displayTrail.features}</div>
            <div>Rating: {displayTrail.rating}</div>
            <div>Length (miles): {displayTrail.length}</div>
            <div>Latitude: {displayTrail.lat}</div>
            <div>Longitude: {displayTrail.lon}</div>
            <a href={`${displayTrail.url}`} target="_blank" rel="noreferrer">
              Trail Website
            </a>
            <Comments trail_id={trailId} user_id={userId} />
          </div>
        </figure>
      </div>
    </div>

  );
};

export default TrailProfile;
