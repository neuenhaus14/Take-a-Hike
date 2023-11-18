import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";


const Comments = ({trail_id, user_id}) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([])
  const [likeStatus, setLikeStatus] = useState(false);
  const [commentValue, setCommentValue] = useState('');

  //loads comments from database on page render
  useEffect (() => {
    axios.get(`/comments-by-trail/${trail_id}`)
    .then((response) => {
      console.log('show comments response', response.data)
      setComments(response.data)
    })
    .catch((err) => console.error(err));
  }, [setComments])

  // adds comment to database and immediately shows on page bc of state
  const addComment = () => {
    console.log(user_id, trail_id)
    axios.post("/add-comment", { options: { user_id, trail_id, comment } })
    .then((response) => {
      setComments(response.data.concat(comments))
      clearInput()
    })
    .catch((err) => console.error(err));
  }

  const updateLikes = (commentId) => {
    axios.put(`/update-like/${commentId}`, {
      options: {
        likeStatus: !likeStatus,
      }
    })
    .then(() => {
      setLikeStatus(true);
      console.log('comment has been liked!')
    })
    .catch((err) => console.error(err));
  }

  // clears the <input> after enter or button press
  const clearInput = () => {
    setCommentValue(' ')
  }
  
  return (
    <div>
      <div id="add-comments">
        <h3>COMMENTS</h3>
        <input id='comment' type="text" placeholder="Share your experience!" value={commentValue}
              onChange={(e) => {setComment(e.target.value); setCommentValue(e.target.value)}} 
              onKeyUp={(e) => e.key === 'Enter' && addComment()} />
        <button onClick = {() => {addComment(); clearInput()}}>Post</button>
        </div>
      <div id="render-comments">
      { comments.map((comment, index) => 
        <div id='comments' key={index}>
          <p>{comment.comment}</p> <span>{moment(comment.createdAt).format('ll')}</span>
          <button onClick = {() => updateLikes(comment.id)}>❤️</button>
          <span>{comment.likes}</span>
        </div>
      )}  
      </div>
    </div>
  )
  

}

export default Comments