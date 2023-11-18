import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const NationalParksEntry = ({ nationalPark }) => {
  return (
    <Link to={`/nationalParkProfile/${nationalPark.id}`}>
      <div className="profile-card">
        <div className="list-item-card">
          <img src={nationalPark.thumbnail} />
          <h3>{nationalPark.name}</h3>
          <div className="info-group">
            <p>City: {nationalPark.city}</p>
          </div>
          <div className="info-group">
            <p>State: {nationalPark.region}</p>
          </div>
          <div className="info-group">
            <p>Rating: {nationalPark.rating}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NationalParksEntry;
