import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const Comments = ({trail_Id, user_Id}) => {
  const [comment, setComment] = useState([]);

  const addComment = () => {
    axios.post("/add-comment", { 
      options: {
        user_Id,
        trail_Id,
        comment
      }
     })
    .then((response) => {
     
    })
    .catch((err) => console.error(err));
  }

  console.log("comment", comment)
  return (
    <div>
      <div id="friend-search">
        <h3>COMMENTS</h3>
        <input type="text" placeholder="What's on your mind?" value={comment}
              onChange={(e) => setComment(e.target.value)} 
              onKeyUp={(e) => e.key === 'Enter' && addComment()} />
        <button onClick = {() => addComment()}>Post</button>
        </div>
    </div>
  )

}

export default Comments