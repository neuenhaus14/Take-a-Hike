import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NationalParksEntry = ({ nationalPark }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/nationalParkProfile/${nationalPark._id}`, { state: { nationalPark } });
  };

  return (
    <button type="button" className="profile-card" onClick={handleClick}>
      <div className="list-item-card">
        <img src={nationalPark.image} alt="nationalPark._id" />
        <h3>{nationalPark.title}</h3>
        <div className="info-group">
          <p>
            Park:
            {nationalPark.parkTitle}
          </p>
        </div>
        <div className="info-group" />
      </div>
    </button>
  );
};

export default NationalParksEntry;
