import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import TrailsList from './TrailsList.jsx';

const TripCreator= () => {

    return (
        <div className="trip-creator-main">
            <h1> Trip Creator</h1>
            <Link to='/trip-creator/trails-list'>Search for a trail</Link>
            <Outlet />
        </div>
    )
}

export default TripCreator