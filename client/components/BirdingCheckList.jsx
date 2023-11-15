// Import Dependencies
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import BirdProfile from "./BirdProfile.jsx";

// Create Functional Component
const BirdingCheckList = () => {
  const [birdSearch, setBirdSearch] = useState("");
  const [birdList, setBirdList] = useState([]);
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [birdSightings, setBirdSightings] = useState([]);

  // Call useEffect on Page Load
  useEffect(() => {
    // Fetch bird list from the server
    axios
      .get("/api/birdList")
      .then((response) => {
        const updatedBirdList = response.data.map((observation) => ({
          scientificName: observation.scientificName,
          commonName: observation.commonName,
          location: observation.location,
          totalObserved: observation.totalObserved,
          observationDate: observation.observationDate,
        }));
        setBirdList(updatedBirdList);
      })
      .catch((err) => console.error("ERROR:", err));
    // Fetch bird sightings from the server
    axios
      .get("/api/birdSightings")
      .then((response) => setBirdSightings(response.data))
      .catch((err) => console.error("ERROR:", err));

    // Fetch user profile
    axios
      .get("/profile")
      .then((profile) => {
        const user = profile.data;
        setUserId(user._id);
        setUserName(user.fullName);
      })
      .catch((err) => console.error("ERROR:", err));
  }, []);

  // Create Search Input Handler
  const handleBirdSearchInput = (event) => setBirdSearch(event.target.value);

  // Create Search Submit Handler
  const handleBirdSearchSubmit = (event) => {
    event.preventDefault();
    // Filter bird list based on search input
    const filteredBirdList = birdList.filter(
      (bird) =>
        bird.scientificName.toLowerCase().includes(birdSearch) ||
        bird.commonName.toLowerCase().includes(birdSearch) ||
        bird.commonFamilyName.toLowerCase().includes(birdSearch) ||
        bird.scientificFamilyName.toLowerCase().includes(birdSearch)
    );
    setBirdList(filteredBirdList);
  };

  // Return Component Template
  return (
    <div className="section is-large">
      <NavBar />
      <h1 className="title" alignment="center">
        {userName}'s Birding Checklist
      </h1>
      <h2 className="subtitle">
        Your one stop shop to keep track of all your Louisiana bird sightings.
        There is no better way to celebrate the great state of Louisiana than
        spotting all the wonderful birds that inhabit it. So get to hiking!
      </h2>
      <form>
        <label>
          <input
            className="input is-info is-medium"
            type="text"
            placeholder="Enter Bird Name Here"
            value={birdSearch}
            onChange={handleBirdSearchInput}
          />
        </label>
        <input
          className="button is-info"
          type="submit"
          value="Search for Bird"
          onClick={handleBirdSearchSubmit}
        />
      </form>
      <div className="birds">
        <div className="profile-card">
          {birdList.map((bird) => (
            <BirdProfile
              bird={bird}
              key={bird.scientificName}
              userId={userId}
              birdSightings={birdSightings}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Export Component
export default BirdingCheckList;
