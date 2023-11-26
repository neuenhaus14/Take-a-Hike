import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

function Comments({ trail_id, user_id }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [likeStatus, setLikeStatus] = useState(false);
  const [commentValue, setCommentValue] = useState('');

  const trailId = parseInt(trail_id, 10);

  // loads comments from database on page render
  useEffect(() => {
    axios.get(`/comments-by-trail/${trail_id}`)
      .then((response) => {
        console.log('show comments response', response.data);
        setComments(response.data);
      })
      .catch((err) => console.error(err));
  }, [setComments]);

  // renders comments on page after enter/post button is clicked
  const updateCommentList = () => {
    axios.get(`/comments-by-trail/${trail_id}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((err) => console.error(err));
  };

  // clears the <input> after enter or button press
  const clearInput = () => { setCommentValue(''); };

  // adds comment to database and immediately shows on page bc of state
  const addComment = () => {
    console.log(user_id, trail_id);
    if (user_id !== undefined) {
      axios.post('/add-comment', { options: { user_id, trail_id, comment } })
        .then((response) => {
          console.log(response);
          console.log('comments', comments);
          setComments(response.data.concat(comments));
          clearInput();
        })
        .catch((err) => console.error(err));
    }
  };

  // updates likes in db by user so user can only like or dislike ONCE
  const updateLikes = (comId) => {
    console.log(comId, user_id, !likeStatus);
    axios.put(`/update-like/${comId}/${user_id}`)
      .then(() => {
        // setLikeStatus(!likeStatus);
        updateCommentList();
        console.log('Like status updated!');
      })
      .catch((err) => console.error(err));
  };

  // deletes the comments only by the userId owner
  const deleteComment = (id) => {
    axios.delete(`/delete-comment/${user_id}/${id}/${trailId}`)
      .then((response) => {
        console.log('deleted', response);
        updateCommentList();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div id="add-comments">
        <h3>COMMENTS</h3>
        <input
          id="comment"
          type="text"
          placeholder="Share your experience!"
          value={commentValue}
          onChange={(e) => { setComment(e.target.value); setCommentValue(e.target.value); }}
          onKeyUp={(e) => e.key === 'Enter' && addComment()}
        />
        <button type="button" onClick={() => { addComment(); clearInput(); }}>Post</button>
      </div>
      <div id="render-comments">
        { comments.map((com, index) => (
          <div id="comments" key={index}>
            <span><b> {com.username.slice(0, -10)}</b></span>
            <span> {com.comment} </span>
            <button id="likeButton" type="button" value={com.id} onClick={(e) => updateLikes(e.target.value)}>❤️ {com.likes}</button>
            <button type="button" onClick={() => deleteComment(com.id)}> 🗑️ </button>
            <p>{moment(com.createdAt).format('ll')}</p>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
