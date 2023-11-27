import React from 'react';
import { Link } from 'react-router-dom';

const FriendProfile = ({ friend, userId }) => {
  console.log('friend', friend);
  console.log('userId', userId);
  return (
    <div>
      <Link to={`/profile/${friend._id}`}>
        <img src={friend.profilePicture} alt="profile" />
        <p>{friend.username}</p>
      </Link>
    </div>
  );
};
export default FriendProfile;