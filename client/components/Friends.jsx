// Import Dependencies
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { KeyboardReturn } from "@mui/icons-material";

// Create Functional Component
const Friends = () => {
  const [userId, setUserId] = useState();
  const [friendSearch, setFriendSearch] = useState("");
  const [resUsers, setResUsers] = useState([]);
  const [friendList, setFriendList] = useState([]);

  const searchFriends = () => {
    axios.post("/search-friends", { 
      options: {
        fullName: friendSearch
      }
     })
    .then((response) => {
      setResUsers(response.data)
    })
    .catch((err) => console.error(err));
  }



  useEffect(() => {
    axios.get("/profile")
    .then((user) => {
      setUserId(user._id);
    })
    .catch((err) => {
      console.error("ERROR:", err);
    });;
  });

console.log(resUsers)
  return (
    <div>
      <h1>GHOST RIDER DO YOU COPY? THIS IS GRETCHEN- TRYING TO MAKE CONTACT, OVER</h1>
      <div id="friend-search">
      <h5>Search for Friends</h5>
      <input type="text" placeholder="Find Friends" value={friendSearch} onChange={(e) => setFriendSearch(e.target.value)}  />
      <button onClick = {() => {searchFriends(); console.log('clicked')}}>Search</button>
      </div>
      <div id='friend-search-results'>
        { resUsers.map((result) => <p>{result.fullName}</p>) }
      </div>

    </div>
  )

}

export default Friends;