'use strict'; // Why is this up here?

// Import Dependencies
import React from 'react';
import ReactDOM from 'react-dom';

// Import Components and Styles
import App from './components/App.jsx';
import './styles/main.css';

// Render Components to DOM 'app' element
ReactDOM.render(<App />, document.getElementById('app'));
