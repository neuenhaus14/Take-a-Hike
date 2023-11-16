import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const FriendsList = ({friends}) => {

  return (
    <div id="friend-list">
      <h3>Friends:</h3>
      { friends.map((friend, index) =>
      <div id='friends' key={index}>
         <p>{friend}</p>
      </div>
      )}
    </div>
  )

}

export default FriendsList