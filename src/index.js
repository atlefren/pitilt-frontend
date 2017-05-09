import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';

import App from './components/App';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import config from './config';


firebase.initializeApp(config);

ReactDOM.render(
    <App />, document.getElementById('root')
);
