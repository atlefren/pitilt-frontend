import React from 'react';
import * as firebase from 'firebase';
import AppNavbar from './AppNavbar';

var provider = new firebase.auth.GoogleAuthProvider();

import TiltList from '../Tilt';



var App = React.createClass({

    getInitialState: function () {
        return {
            isLoggedIn: false
        };
    },

    componentDidMount: function () {
        firebase.auth().onAuthStateChanged(function (user) {
            this.setState({
                isLoggedIn: !!user
            });
        }.bind(this));
    },

    logIn: function () {
        firebase.auth().signInWithPopup(provider);
    },

    logOut: function () {
        firebase.auth().signOut();
    },

    render: function () {
        var content;
        if (this.state.isLoggedIn) {
            content = <TiltList />;
        }

        var user = firebase.auth().currentUser;
        return (
            <div >
                <AppNavbar
            user={user}
            logIn={this.logIn}
            logOut={this.logOut}
            isLoggedIn={this.state.isLoggedIn}/>
                <div className='container'>
                {content}
                </div>
            </div>
        );
    }
});

export default App;
