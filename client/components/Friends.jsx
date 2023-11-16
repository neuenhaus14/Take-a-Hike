// Import Dependencies
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import FriendsList from './FriendsList.jsx'

// Create Functional Component
const Friends = () => {
  const [userId, setUserId] = useState();
  const [friendSearch, setFriendSearch] = useState("");
  const [friendAddedButton, setFriendAddedButton] = useState(false);
  const [resUsers, setResUsers] = useState([]);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    axios.get(`friends-list/${1}`)
    .then((response) => {
      setFriendList(response.data)
    })
    .catch((err) => console.error(err));
  }, [setFriendList]);

  const searchFriends = () => {
    console.log(friendSearch)
    axios.post("/search-friends", { 
      options: {
        fullName: friendSearch.trim()
      }
     })
    .then((response) => {
      setFriendAddedButton(false);
      setResUsers(response.data)
      console.log("res data", response.data)
    })
    .catch((err) => console.error(err));
  }

  const addFriends = (friend) => {
    console.log('friend', friend)
    axios.put(`/add-friends/${1}`, {
      options: {
        friend_user_id: friend._id
      }
    })
    .then(() => {
      updateFriendList();
      setFriendAddedButton(true);
    })
    .catch((err) => console.error(err))
  }

  const updateFriendList = () => {
    axios.get(`friends-list/${1}`)
    .then((response) => {
      setFriendList(response.data)
    })
    .catch((err) => console.error(err));
  }

  return (
    <div>
      <div id="friend-search">
      <h5>Search for Friends</h5>
      <input type="text" placeholder="Find Friends" value={friendSearch}
            onChange={(e) => setFriendSearch(e.target.value)} 
            onKeyUp={(e) => e.key === 'Enter' && searchFriends()} />
      <button onClick = {() => {searchFriends(); console.log('clicked')}}>Search</button>
      </div>
      <div id='friend-search-results'>
      { resUsers.map((result) =>
      <div id='result-elements' key={result._id}>
         <img src={`${result.picture}`} width="50" height="50"/> 
         <span>{result.fullName}</span> <br />
         <span> {result.email.slice(0, 11)} </span>
         <button type="button" onClick = {() => addFriends(result)}>
          {friendAddedButton ? "Friends" : "Add Friend"} </button>
         <br /> 
      </div>
      )}
      <div>
        <FriendsList friends={friendList}/>
      </div>
      </div>
    </div>
  )

}

export default Friends;