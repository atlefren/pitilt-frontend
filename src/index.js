import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';

import App from './components/App';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN
};


firebase.initializeApp(config);

ReactDOM.render(
    <App />, document.getElementById('root')
);
