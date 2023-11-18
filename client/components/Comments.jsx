import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";


const Comments = ({trail_id, user_id}) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([])
  const [likeStatus, setLikeStatus] = useState(false);

  const addComment = (comment) => {
    console.log(user_id, trail_id)
    axios.post("/add-comment", { options: { user_id, trail_id, comment } })
    .then((response) => {
      //updateCommentList()
      console.log('add comment', response)
      setComments(response.data.concat(comments))
      console.log('comment has been posted!')
    })
    .catch((err) => console.error(err));
  }

  useEffect (() => {
    axios.get(`/comments-by-trail/${trail_id}`)
    .then((response) => {
      console.log('show comments response', response.data)
      setComments(response.data)
    })
    .catch((err) => console.error(err));
  }, [setComments])


  // const updateCommentState = (response) => {
  //   setComments(response)
  // }

  // const updateCommentList = () => {
  //   axios.get(`/comments-by-trail/${trail_id}`)
  //   .then((response) => {
  //     console.log('show comments response', response.data)
  //     //setComments(response.data)
  //     updateCommentState(response.data)
  //   })
  //   .catch((err) => console.error(err));
  // }

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
  
  return (
    <div>
      <div id="add-comments">
        <h3>COMMENTS</h3>
        <input type="text" placeholder="Share your experience!" value={comment}
              onChange={(e) => setComment(e.target.value)} 
              onKeyUp={(e) => e.key === 'Enter' && addComment(comment)} />
        <button onClick = {() => addComment(comment)}>Post</button>
        </div>
      <div id="render-comments">
      { comments.map((comment, index) => 
        <div id='comments' key={index}>
          <p>{comment.comment}</p> <span>{moment(comment.createdAt).format('ll')}</span>
          <button onClick = {() => updateLikes(comment.id)}>❤️{comment.likes}</button>
        </div>
      )}  
      </div>
    </div>
  )
  

}

export default Comments