import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const FriendsList = ({friends, userId}) => {
  const [friendRemoveButton, setfriendRemoveButton] = useState(false);

  const currentUser = userId;

  const removeFriends = (friend) => {
    axios.delete(`/delete-friends/${currentUser}`, {
      options: {
        friend_user_id: friend._id
        //FRIEND ID DOES NOT EXIST BC YOU ARE ONLY GETTING NAMES AS FRIEND
      }
    })
    .then(() => {
      updateFriendList();
      setfriendRemoveButton(true);
    })
    .catch((err) => console.error(err))
  }

  return (
    <div id="friend-list">
      <h3>Friends:</h3>
      { friends.map((friend, index) =>
      <div id='friends' key={index}>
         <p>{friend}</p>
         <button type="button" onClick = {() => removeFriends(friend)}>
          {friendRemoveButton ? "Unfriended" : "Unfriend"} </button>
         <br />
      </div>
      )}
    </div>
  )

}

export default FriendsList