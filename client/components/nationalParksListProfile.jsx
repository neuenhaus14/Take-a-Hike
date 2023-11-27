import React from 'react';
import { useLocation, useParams, useLoaderData } from 'react-router-dom';
import he from 'he';
import NavBar from './NavBar';
import Comments from './Comments';

const NationalParkProfile = () => {
  const userData = useLoaderData();
  const userId = userData._id;
  const location = useLocation();
  const { nationalPark } = location.state || {};
  const description = he.decode(nationalPark.description);
  return (
    <div>
      <NavBar />
      <div className="trails">
        <figure className="profile-card">
          <img src={nationalPark.image} alt={nationalPark._id} />
          <div className="post__header">
            <h1>{nationalPark.title}</h1>
          </div>
          <div className="post__header">
            <h2 className="profile-card">
              {nationalPark.parkTitle}
            </h2>
          </div>
          <div className="post__header" style={{ display: 'block' }}>
            <p dangerouslySetInnerHTML={{ __html: description }} />
            <p>
              <a href={nationalPark.link} target="_blank" rel="noreferrer">
                Trail Website
              </a>
            </p>
            <Comments trail_id={nationalPark._id} user_id={userId} />
          </div>
        </figure>
      </div>

    </div>
  );
};

export default NationalParkProfile;