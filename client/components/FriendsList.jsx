import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const FriendsList = ({friends}) => {



  return (
    <div id="friend-list">
      <h3>Friends:</h3>
      { friends.map((friend) =>
      <div id='friends'>
         {/* <img key={index} src={`${result.picture}`} width="50" height="50"/>  */}
         <p>{friend.fullName}</p>
         {/* <button type="button" onClick = {() => addFriends(result)}>
          Add Friend</button> */}
      </div>
      )}
    </div>
  )

}

export default FriendsList