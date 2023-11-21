import React from 'react';
import axios from 'axios';

function FriendsList({ friends, userId, updateFriendList }) {
  const currentUser = userId;

  const removeFriends = (friend) => {
    console.log('friend', friend);
    axios.delete(`/delete-friends/${currentUser}/${friend._id}`)
      .then(() => {
        updateFriendList();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div id="friend-list">
      <h3>Friends:</h3>
      { friends.map((friend, index) => (
        <div id="friends" key={index}>
          <p>{friend.fullName}</p>
          <button type="button" onClick={() => removeFriends(friend)}>
            Unfriend
          </button>
          <br />
        </div>
      ))}
    </div>
  );
}

export default FriendsList;
