import React, { useState, useEffect } from 'react';
import Fab from '@mui/material/Fab';
import { useLocation } from 'react-router-dom';
import he from 'he';

const NationalParkProfile = () => {
  const location = useLocation();
  const { nationalPark } = location.state || {};
  const description = he.decode(nationalPark.description);
  return (
    <div className="trails">
      <Fab
        className="fab"
        color="primary"
        size="large"
      />
      <figure className="profile-card">
        <img src={nationalPark.image} alt="nationalPark._id" />
        <div className="post__header">
          <h1>{nationalPark.title}</h1>
        </div>
        <div className="post__header">
          <h2 className="profile-card">
            {nationalPark.parkTitle}
          </h2>
        </div>
        <div className="post__header" style={{ display: 'block' }}>
          <p dangerouslySetInnerHTML={{ __html: description }} />
          <p>
            <a href={nationalPark.link} target="_blank" rel="noreferrer">
              Trail Website
            </a>
          </p>

        </div>
      </figure>
    </div>
  );
};

export default NationalParkProfile;