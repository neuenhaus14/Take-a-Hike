import axios from 'axios';
import React, { useEffect, useState, lazy } from 'react';
import { Outlet, Link, useLoaderData } from 'react-router-dom';
// import TripCreator from './TripCreator.jsx';
// import Friends from './Friends.jsx';

// import NavBar from './NavBar.jsx';
const TripCreator = lazy(() => import('./TripCreator'));
const Friends = lazy(() => import('./Friends'));
const NavBar = lazy(() => import('./NavBar'));

const UserProfile = () => {
  const [profileName, setProfileName] = useState('');
  const [picture, setPicture] = useState('');
  const [email, setEmail] = useState('');
  const [myTrips, setMyTrips] = useState([]);
  const [showOutlet, setShowOutlet] = useState(false);

  const handleButtonClick = () => {
    setShowOutlet(true);
  };

  const userData = useLoaderData();
  const userId = userData._id;

  useEffect(() => {
    axios.get('/profile').then((profile) => {
      const user = profile.data;
      //console.log(user);
      setProfileName(user.fullName);
      setPicture(user.picture);
      setEmail(user.email);
    });
  });

  return (
    <div className="profile-card">
      <NavBar />
      <h1>Welcome {profileName}</h1>
      <a href={picture} />
      <p>{email}</p>
      <div className="outlet">
        {/* set link to user trips and make the click conditionally render the outlet */}
        <Link to={`/profile/user-trips/${userId}`}>
          <button type="button" onClick={() => { handleButtonClick(); }}>
            My Trips
          </button>  
        </Link>
        {/* set link to trip - creator and make the click conditionally render the outlet */}
        <Link to={`/profile/trip-creator/${userId}`}>
          <button type="button" onClick={() => { handleButtonClick(); }}>
            Create a Trip
          </button>
        </Link>
        {/* set link to friends and make the click conditionally render the outlet */}
        <Link to={`/profile/friends/${userId}`}>
          <button type="button" onClick={() => { handleButtonClick(); }}>
            Friends
          </button> 
        </Link>
        {/* conditional outlet render based on clicks */}
        {showOutlet ? (
          <Outlet />)
          : (<div />)}
      </div>
      
    </div>
  );

  // return (
  //   <>
  //     <h1 className="Header" alignment="center">
  //       UserProfile
  //     </h1>
  //     <div>Username:</div>
  //     {packingListNames.map((listName) => {
  //       return <li>{listName}</li>;
  //     })}
  //   </>
  // );
};

export default UserProfile;
