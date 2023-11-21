import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

function Comments({ trail_id, user_id }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  // const [commentsUsers, setCommentsUsers] = useState([]);
  const [likeStatus, setLikeStatus] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [likes, setLikes] = useState(0);

  // loads comments from database on page render
  useEffect(() => {
    axios.get(`/comments-by-trail/${trail_id}`)
      .then((response) => {
        console.log('show comments response', response.data);
        setComments(response.data);
      })
      .catch((err) => console.error(err));
  }, [setComments]);

  useEffect(() => {
    console.log(likes);
  }, [setLikes]);

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

  const updateLikes = (com) => {
    axios.put(`/update-like/${com.id}`, {
      likeStatus: !likeStatus,
    })
      .then(() => {
        setLikeStatus(!likeStatus);
        setLikes(com.likes);
        console.log('Like status updated!', likeStatus);
      })
      .catch((err) => console.error(err));
  };

  // deletes the comments only by the userId owner
  const deleteComment = (id) => {
    axios.delete(`/delete-comment/${user_id}/${id}/${trail_id}`)
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
            <button type="button" onClick={() => updateLikes(com)}>❤️ {com.likes}</button>
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
