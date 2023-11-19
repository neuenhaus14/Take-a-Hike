import React from 'react';
import 'regenerator-runtime/runtime';
import { Image } from 'cloudinary-react';
import Avatar from '@material-ui/core/Avatar';
// import { AccountCircleIcon } from '@mui/icons-material';

const preset = 'hikeimages';
// const cloudName = 'dbwbxubwi';

const PhotoPost = ({ trailImageURL, cloudName, displayTrail }) => {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt={'user.name'} src="" />
        <h4>Username</h4>
      </div>
      <Image
        className="post__image"
        cloudName={cloudName}
        publicId={trailImageURL}
        width="400"
        crop="scale"
      />
      <div className="post__text">
        <figcaption>
          <h4>
            <strong>Username</strong>: caption
          </h4>
          <p>Taken at: {displayTrail.name}</p>
        </figcaption>
      </div>
    </div>
  );
};

export default PhotoPost;
