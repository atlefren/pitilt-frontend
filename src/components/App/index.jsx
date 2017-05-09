import React from 'react';
import * as firebase from 'firebase';
import AppNavbar from './AppNavbar';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import PrivateRoute from '../PrivateRoute';
import PlotList from '../Plot';

var provider = new firebase.auth.GoogleAuthProvider();

function FrontPage() {
    return <h1>Front page</h1>;
}

var App = React.createClass({

    getInitialState: function () {
        return {
            isLoggedIn: false
        };
    },

    componentDidMount: function () {
        this.setState({
            isLoggedIn: !!firebase.auth().currentUser
        });
        firebase.auth().onAuthStateChanged(function (user) {
            this.setState({
                isLoggedIn: !!user
            });
            if (!user) {
                //TODO: redirect to frontpage
            }
        }.bind(this));
    },

    logIn: function () {
        firebase.auth().signInWithPopup(provider);
    },

    logOut: function () {
        firebase.auth().signOut();
    },

    render: function () {

        var user = firebase.auth().currentUser;
        return (
            <Router>
                <div>
                    <AppNavbar user={ user }
                               logIn={ this.logIn }
                               logOut={ this.logOut }
                               isLoggedIn={ this.state.isLoggedIn } />
                    <div className='container'>
                        <Route exact
                               path='/'
                               component={ FrontPage } />
                        <PrivateRoute path='/plots'
                                      component={ PlotList } />
                    </div>
                </div>
            </Router>
        );
    }
});

export default App;
