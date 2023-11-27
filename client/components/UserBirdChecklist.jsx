import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserBirdChecklist = () => {
  const [birdSightings, setBirdSightings] = useState([]);
  const [displayBirds, setDisplayBirds] = useState(false);
  const getUserBirdChecklist = () => {
    axios.get('/api/birdSightings/5')
      .then((birds) => {
        console.log('successfully fetched bird sightings!', birds);
        setBirdSightings(birds.data);
        setDisplayBirds(true);
      })
      .catch((err) => {
        console.error('something went wrong when fetching bird sightings!', err);
      });
  };

  useEffect(() => {
    getUserBirdChecklist();
  }, []);
  return (
    <div className="user-bird-checklist">
      <h2>User Bird Checklist</h2>
      <div className="bird-list box">
        {birdSightings.map((bird) => (
          <div className="bird" key={bird._id}>
            <p>{bird.bird_id} </p>
            <input type="checkbox" onClick={() => console.log('ok workin')} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBirdChecklist;