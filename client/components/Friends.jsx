// Import Dependencies
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FriendsList from './FriendsList';

// Create Functional Component
const Friends = () => {
  const [friendSearch, setFriendSearch] = useState('');
  const [friendSearchResults, setFriendSearchResults] = useState(false);
  const [resUsers, setResUsers] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [commentValue, setCommentValue] = useState('');
  const userId = useParams();
  console.log('userId in friends', userId);
  const currentUser = userId.userId;

  // automatically loads the friend list if it exists
  useEffect(() => {
    axios.get(`/friends-list/${currentUser}`)
      .then((response) => {
        setFriendList(response.data);
      })
      .catch((err) => console.error(err));
  }, [setFriendList]);

  // updates friend list if friend is added
  const updateFriendList = () => {
    axios.get(`/friends-list/${currentUser}`)
      .then((response) => {
        console.log(response);
        setFriendList(response.data);
      })
      .catch((err) => console.error(err));
  };

  // clears the <input> after enter or button press
  const clearInput = () => { setCommentValue(''); };

  // searches for users in db that match the fullName from search
  const searchFriends = () => {
    axios.post('/search-friends', {
      options: {
        fullName: friendSearch.trim(),
      },
    })
      .then((response) => {
        setResUsers(response.data);
        clearInput();
        setFriendSearchResults(true);
      })
      .catch((err) => console.error(err));
  };

  // adds users to friends join table in db
  const addFriends = (friend) => {
    axios.put(`/add-friends/${currentUser}`, {
      options: {
        friend_user_id: friend._id,
      },
    })
      .then(() => {
        updateFriendList();
        setFriendSearchResults(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div id="friend-search">
        <h3>Search for Friends</h3>
        <input
          type="text"
          placeholder="Find Friends"
          value={commentValue}
          onChange={(e) => { setFriendSearch(e.target.value); setCommentValue(e.target.value); }}
          onKeyUp={(e) => e.key === 'Enter' && searchFriends()}
        />
        <button type="button" onClick={() => { searchFriends(); clearInput(); }}>Search</button>
      </div>
      {friendSearchResults
        ? (
          <div id="friend-search-results">
            { resUsers.map((result) => (
              <div id="result-elements" key={result._id}>
                <img src={`${result.picture}`} alt="profPic" width="50" height="50" />
                <span>{result.fullName}</span> <br />
                <span> {result.email.slice(0, -10)} </span>
                <button type="button" onClick={() => addFriends(result)}>
                  Add Friend
                </button>
                <br />
              </div>
            ))}
          </div>
        ) : null }
      <div>
        <FriendsList
          friends={friendList}
          userId={userId}
          updateFriendList={updateFriendList}
        />
      </div>
    </div>
  );
}

export default Friends;
