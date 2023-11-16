import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";


const Comments = ({trail_id, user_id}) => {
  const [comment, setComment] = useState([]);

  const addComment = () => {
    console.log(user_id, trail_id)
    axios.post("/add-comment", { 
      options: {
        user_id,
        trail_id,
        comment
      }
     })
    .then((response) => {
     console.log('comment has been posted!')
    })
    .catch((err) => console.error(err));
  }

  return (
    <div>
      <div id="friend-search">
        <h3>COMMENTS</h3>
        <input type="text" placeholder="Share your experience!" value={comment}
              onChange={(e) => setComment(e.target.value)} 
              onKeyUp={(e) => e.key === 'Enter' && addComment()} />
        <button onClick = {() => addComment()}>Post</button>
        </div>
    </div>
  )

}

export default Comments