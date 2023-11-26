// Import Dependencies
import React, {
  useState, useEffect, lazy, Suspense, 
} from 'react';
import axios from 'axios';
import {
  Route, createHashRouter, createRoutesFromChildren, RouterProvider, 
} from 'react-router-dom';

// import './styles/main.css';
// import TrailsList from './TrailsList.jsx';
// import Quartermaster from './Quartermaster.jsx';
// import TrailProfile from './TrailProfile.jsx';
// import UserProfile from './UserProfile.jsx';
// import BirdingCheckList from './BirdingCheckList.jsx';
// import PackingList from './PackingList.jsx';
// import Login from './Login.jsx';
// import UserTrips from './UserTrips.jsx';
// import BirdProfile from './BirdProfile.jsx';
// import TripCreator from './TripCreator.jsx';
// import Weather from './Weather.jsx';
// import NationalParksList from './nationalParksList';
// import NationalParkProfile from './nationalParksListProfile.jsx';
// import Friends from './Friends.jsx';

const TrailsList = lazy(() => import('./TrailsList'));
const Quartermaster = lazy(() => import('./Quartermaster'));
const TrailProfile = lazy(() => import('./TrailProfile'));
const UserProfile = lazy(() => import('./UserProfile'));
const BirdingCheckList = lazy(() => import('./BirdingCheckList'));
const PackingList = lazy(() => import('./PackingList'));
const Login = lazy(() => import('./Login'));
const UserTrips = lazy(() => import('./UserTrips'));
const BirdProfile = lazy(() => import('./BirdProfile'));
const TripCreator = lazy(() => import('./TripCreator'));
const Weather = lazy(() => import('./Weather'));
const NationalParksList = lazy(() => import('./nationalParksList'));
const NationalParkProfile = lazy(() => import('./nationalParksListProfile'));
const Friends = lazy(() => import('./Friends'));

const App = () => {
  const [trailList, setTrailList] = useState([]);
  const [loadingTrails, setLoadingTrail] = useState(false);
  const getUserLoader = async () => {
    try {
      const response = await axios.get('/profile');
      return response.data;
    } catch (err) {
      console.error(err);
      throw (err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('TrailList')) {
      const trails = JSON.parse(localStorage.getItem('TrailList'));
      setTrailList(trails);
    }
  }, []);

  // were in trail list
  const handleGetTrails = (location) => {
    setLoadingTrail(true);
    axios
      .get('/api/trailslist', {
        params: { lat: location.lat, lon: location.lon },
      })
      .then((response) => {
        setTrailList(response.data.data);
        // add data to local storage
        localStorage.setItem('TrailList', JSON.stringify(response.data.data));
      })
      .then(() => {
        setLoadingTrail(false);
      })
      .catch((err) => {
        console.error('ERROR: ', err);
      })
      .finally(() => {
        setLoadingTrail(false);
      });
  };

  const router = createHashRouter(
    createRoutesFromChildren(
      <Route>
        <Route
          path="trailslist"
          element={(
            <TrailsList
              loading={loadingTrails}
              handleGetTrails={handleGetTrails}
              trailList={trailList}
            />
          )}
          loader={getUserLoader}
        />
        <Route path="/" element={<Login />} />
        <Route
          path="trailprofile/:id"
          element={<TrailProfile trailList={trailList} />}
          loader={getUserLoader}
        />
        <Route
          path="nationalParkProfile/:id"
          element={<NationalParkProfile />}
        />
        <Route path="hiking-trails" element={<NationalParksList />} />
        <Route path="weather" element={<Weather />} />
        <Route path="quartermaster" element={<Quartermaster />} />
        <Route path="birdingchecklist" element={<BirdingCheckList />} />
        <Route path="profile" element={<UserProfile />} loader={getUserLoader}>
          <Route path="user-trips/:userId" element={<UserTrips />} />
          <Route path="trip-creator/:userId" element={<TripCreator />}>
            <Route path="packing-list/:userId" element={<PackingList />} />
            <Route path="trails-list/:userId" element={<TrailsList />} />
          </Route>
          <Route path="friends/:userId" element={<Friends />} />
        </Route>
      </Route>,
    ),
  );

  return (
    <div className="app">
      <div className="app__header">
        <img
          className="app__logo"
          src="https://res.cloudinary.com/dbwbxubwi/image/upload/v1649015216/Parc%20des%20Familles%20Trail%20by%20NOMAMBO/qoej8fkfe2og2gkdkpmn.png"
        />
        <h1 className="Header app__header" alignment="center">
          Trail Feathers
        </h1>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  );
};

// Export Component
export default App;
