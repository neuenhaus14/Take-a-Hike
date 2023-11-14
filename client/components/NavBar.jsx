import React from 'react';
import { Link, Outlet } from 'react-router-dom';
// axios?

const NavBar = () => {
  return (
    <div>
      <nav
        style={{
          borderBottom: 'solid 1px',
          paddingBottom: '1rem',
        }}
      >
        <Link to='/login'>Login</Link> |{' '}
        <Link to='/trailslist'>Trails List</Link> |{' '}
        {/* <Link to="/trailprofile/1">Trail Profile</Link> |{' '} */}
        <Link to='/quartermaster'>Quartermaster</Link> |{' '}
        {/* <Link to="/packinglist">Packing List</Link> |{" "} */}
        <Link to='/birdingchecklist'>Birding Checklist</Link> |{' '}
        <Link to='/profile'>User Profile</Link> |{' '}
      </nav>
    </div>
  );
};

export default NavBar;