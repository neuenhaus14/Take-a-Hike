import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Login = () => {
  return (
    <div className='profile-card'>
      <h1>Welcome to Trail Feathers</h1>
      <form action="/login/google" method="GET">
        <button type="submit">Sign In With Google</button>
      </form>
    </div>
  );
};

export default Login;
