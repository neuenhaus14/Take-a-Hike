// Import Dependencies
import React, { useEffect, useState, lazy } from 'react';
import axios from 'axios';

const NavBar = lazy(() => import('./NavBar'));
const BirdProfile = lazy(() => import('./BirdProfile'));

const BirdingCheckList = () => {
  const [birdSearch, setBirdSearch] = useState('');
  const [birdList, setBirdList] = useState([]);
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState('');
  const [birdSightings, setBirdSightings] = useState([]);
  const [selectedState, setSelectedState] = useState('LA');

  const states = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ];

  useEffect(() => {
    // Fetch bird list from the server
    axios
      .get(`/api/birdList?state=${selectedState}`)
      .then((response) => {
        setBirdList(response.data);
      })
      .catch((err) => console.error('ERROR:', err));

    // Fetch bird sightings from the server
    // axios
    //   .get("/api/birdsightings")
    //   .then((response) => setBirdSightings(response.data))
    //   .catch((err) => console.error("ERROR:", err));

    // Fetch user profile
    axios
      .get('/profile')
      .then((profile) => {
        const user = profile.data;
        setUserId(user._id);
        setUserName(user.fullName);
      })
      .catch((err) => console.error('ERROR:', err));
  }, [selectedState]);

  const handleBirdSearchInput = (event) => setBirdSearch(event.target.value);

  const handleBirdSearchSubmit = async (event) => {
    event.preventDefault();

    try {
      // Fetch bird list from the server based on the search input and selected state
      const response = await axios.get(
        `/api/birdList/search?state=${selectedState}&search=${birdSearch}`,
      );
      setBirdList(response.data);

      // clear the search input box
      setBirdSearch('');
    } catch (error) {
      console.error('Error fetching bird list:', error.message);
    }
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  return (
    <div className="section is-large">
      <NavBar />
      <h1 className="title" alignment="center">
        {userName}'s Birding Checklist
      </h1>
      <h2 className="subtitle">
        Your one-stop shop to keep track of all your bird sightings.
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
        <div>
          <label>
            Select State:
            <select
              className="select is-info is-medium"
              value={selectedState}
              onChange={handleStateChange}
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>
        </div>
      </form>
      <div className="birds">
        <div className="profile-card">
          {birdList.slice(0, 25).map((bird) => (
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

export default BirdingCheckList;
