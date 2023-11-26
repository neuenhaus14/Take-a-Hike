import React, { useState, useEffect } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Comments from './Comments.jsx';
import PhotoPost from './PhotoPost.jsx';

const preset = 'hikeimages';
const cloudName = 'dbwbxubwi';

const TrailProfile = ({ trailList }) => {
  const userData = useLoaderData();
  const userId = userData._id;
  console.log(userId);
  
  // console.log(trailList)
  const { id } = useParams();
  const displayTrail = trailList.find((trail) => trail.id == id);
  const trailId = parseInt(id);
  // console.log(`TRAILPROFILE || LINE 11 || displayTrail`, displayTrail); // access params

  // const getTrailId = trailList.map((trail) => setTrailId(trail.id))

  const [image, setImage] = useState('');
  const [trailImageURLs, setTrailImageURLs] = useState();

  useEffect(() => {
    const loadImages = async () => {
      try {
        const { data } = await axios.post('/api/images/', {
          trailFolderName: displayTrail.name,
        });
        // console.log('TRAILPROFILE || LOADIMAGES || LINE 24 || data', data);
        setTrailImageURLs(data);
      } catch (error) {
        // console.error('TRAILPROFILE || LOADIMAGES || LINE 27 || error', error);
      }
    };
    if (displayTrail) {
      loadImages();
    }
  }, [id, displayTrail, trailList]);

  // temp variable to test tagging functionality with cloudinary upload widget
  // const trailName = 'Trail 2';
  // Can I attach a tag to the uploaded image, and filter photos from get requests using the tags param as an identifier for different trails?

  // console.log(`TRAIL PROFILE || LINE 8 || image `, image);

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  // create upload widget
  let widget;
  if (displayTrail) {
    widget = cloudinary.createUploadWidget(
      // NEED TO ADD FOLDER TO UPLOAD PATH. IF NO FOLDER CREATE ONE?
      {
        cloudName,
        uploadPreset: preset,
        maxFiles: 3,
        folder: displayTrail.name, // substitute with trail name passed through props from TrailList Component
        // add userId tag to filter by user
        tags: [displayTrail.name],
      },
      (err, result) => {
        if (!err && result && result.event === 'success') {
          // console.log('TRAILPROFILE || WIDGET || LINE 21 || result', result);
        }
      },
    );
  }
  const showWidget = (event, widget) => {
    event.preventDefault();
    widget.open();
  };
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  // create get request to backend to get all images from cloudinary

  // const loadImages = async () => {
  //   try {
  //     const res = await fetch(`/api/images/`);
  //     const data = await res.json();
  //     console.log('TRAILPROFILE || LOADIMAGES || LINE 48 || data', data);
  //     setTrailImageURLs(data);
  //   } catch (error) {
  //     console.error('TRAILPROFILE || LOADIMAGES || LINE 51 || error', error);
  //   }
  // };

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  return (
    <div className="trails">
      {/* ////////////////////////// */}

      {/* <button
        className="post__button"
        onClick={(e) => {
          showWidget(e, widget);
        }}
      >
        UPLOAD PHOTOS
      </button> */}

      <Fab
        className="fab"
        // style={{ marginTop: 200 }}
        color="primary"
        size="large"
      >
        <AddIcon
          onClick={(e) => {
            showWidget(e, widget);
          }}
        />
      </Fab>
      {/* ////////////////////////// */}
      <figure className="profile-card">
        <img src={`${displayTrail.thumbnail}`} />
        {/* <figcaption> */}
        {/* <div> */}
        <div className="post__header">
          <h1>{displayTrail.name}</h1>
        </div>
        <div className="post__header">
          <h2 className="profile-card">
            {displayTrail.city}, {displayTrail.region}
          </h2>
        </div>
        <p className="post__header">{displayTrail.description}</p>
        <p className="post__header">{displayTrail.directions}</p>
        <div className="post__header__2">
          <div>Difficulty Level: {displayTrail.difficulty}</div>
          <div>Features: {displayTrail.features}</div>
          <div>Rating: {displayTrail.rating}</div>
          <div>Length (miles): {displayTrail.length}</div>
          <div>Latitude: {displayTrail.lat}</div>
          <div>Longitude: {displayTrail.lon}</div>
          <a href={`${displayTrail.url}`} target="_blank" rel="noreferrer">
            Trail Website
          </a>
          <Comments trail_id={trailId} user_id={userId} />
        </div>
        {/* </div> */}
        {/* <input type="file" onChange={(e) => setImage(e.target.files[0])} /> */}
        {/* </figcaption> */}
      </figure>
      <div className="trails">
        <div className="trail-table">
          {trailImageURLs ? (
            // <div> div to house images for css styling
            trailImageURLs.map((trailImageURL, index) => (
              // profile-card classname creates space between cards
              <div>
                <PhotoPost
                  // className="list-item-card"
                  key={index}
                  cloudName={cloudName}
                  trailImageURL={trailImageURL}
                  displayTrail={displayTrail}
                  // width="300"
                  // height="300"
                  // crop="scale"
                />

                {/* <div className="info-group">
                <p>Taken at: {displayTrail.name}</p>
              </div> */}
              </div>
            )) // </div>
          ) : (
            <></>
            // <p src="https://i.gifer.com/ZZ5H.gif">Getting images</p>
          )}
          {/* {trailImageURLs ? (
          // <div> div to house images for css styling
          trailImageURLs.map((trailImageURL, index) => (
            <Image
              key={index}
              cloudName={cloudName}
              publicId={trailImageURL}
              width="300"
              crop="scale"
            />
          )) // </div>
        ) : (
          <p src="https://i.gifer.com/ZZ5H.gif">Getting images</p>
        )} */}
        </div>
      </div>
      {/* </figure> */}
    </div>
  );
};

export default TrailProfile;
