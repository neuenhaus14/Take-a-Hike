// Import Dependencies
import React from "react";
import { useEffect, useState } from "react";

// Import Components
// import Login from "./Login.jsx"
import Quartermaster from "./Quartermaster.jsx"
import TrailFeathers from "./TrailFeathers.jsx"
import Trails from "./Trails.jsx"
import TrailsList from "./TrailsList.jsx"
import UserProfile from "./UserProfile.jsx"

const App = () => {
  return (
    <>
      <h1 className="Header" alignment="center">
        Take a Hike in Louisiana
      </h1>
      <h2>All parks within 500 miles radius</h2>
      {/* <Login/> */}
      <UserProfile/>
      <TrailsList/>
      <Trails/>
      <Quartermaster/>
      <TrailFeathers/>
    </>
  );
};

export default App;
