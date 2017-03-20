import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';

import App from './components/App';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

var config = {
    apiKey: 'AIzaSyByKiLyRv7DdE-LUx3p_nSQtQyDzy7TvHI',
    authDomain: 'pitilt-7a37c.firebaseapp.com',
    databaseURL: 'https://pitilt-7a37c.firebaseio.com',
    storageBucket: 'pitilt-7a37c.appspot.com',
    messagingSenderId: '375444805601'
};

firebase.initializeApp(config);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
