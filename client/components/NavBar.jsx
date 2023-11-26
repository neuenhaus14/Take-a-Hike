import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';

const NavBar = () => {
  // log the user out
  const handleLogout = () => {
    axios.get('/logout')
      .then((response) => {
        if (response.status === 200) {
          window.location.href = '/';
        } else {
          console.log('not working');
        }
      })
      .catch((err) => {
        console.error('Error logging out', err);
      });
  };

  return (
    <div>
      <nav
        style={{
          borderBottom: 'solid 1px',
          paddingBottom: '1rem',
        }}
      >
        |{' '}
        <Link to="/trailslist">Trails List</Link> |{' '}
        {/* <Link to="/trailprofile/1">Trail Profile</Link> |{' '} */}
        <Link to="/weather">Weather</Link> |{' '}
        <Link to="/quartermaster">Quartermaster</Link> |{' '}
        {/* <Link to="/packinglist">Packing List</Link> |{" "} */}
        <Link to="/birdingchecklist">Birding Checklist</Link> |{' '}
        <Link to="/profile">User Profile</Link> |{' '}
        <Link to="/hiking-trails">Hiking Trails</Link> |{' '}
        <Link to="/" onClick={handleLogout}>Logout</Link> |{' '}
      </nav>
    </div>
  );
};

export default NavBar;