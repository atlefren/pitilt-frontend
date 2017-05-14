import React from 'react';
import * as firebase from 'firebase';
import AppNavbar from './AppNavbar';
import {BrowserRouter as Router, Route, Redirect, Switch, Link} from 'react-router-dom';

import PlotList from '../Plot';
import Profile from '../Profile';
import Login from './Login';
import Logout from './Logout';


function FrontPage(props) {
    var loginLink = null;
    if (!props.authed) {
        loginLink = (
            <Link to="/login">Log in</Link>
        );
    }
    return (
        <div>
            <h1>Pitilt</h1>
            {loginLink}
        </div>
    );
}

function PublicRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => <Component authed={authed} {...props} />}
        />
    );
}

function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
        />
    );
}

class App extends React.Component {

    state = {
        authed: false,
        loading: true,
    }

    componentDidMount() {
        this.removeListener = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authed: true,
                    loading: false
                });
            } else {
                this.setState({
                    authed: false,
                    loading: false
                });
            }
        });
    }

    componentWillUnmount () {
        this.removeListener()
    }
    render () {
        if (this.state.loading) {
            return <h2>Loading</h2>;
        }
        var user = firebase.auth().currentUser;
        return (
            <Router>
                <div>
                    <AppNavbar 
                        user={user}
                        logOut={ this.logOut }
                        authed={ this.state.authed } />
                    <div className="container">
                        <Switch>
                            <PublicRoute authed={this.state.authed} path='/' exact component={FrontPage} />
                            <Route path='/login' component={Login} />
                            <Route path='/logout' component={Logout} />
                            <PrivateRoute 
                                authed={this.state.authed}
                                path='/plots'
                                component={PlotList} />
                            <PrivateRoute 
                                authed={this.state.authed}
                                path='/profile'
                                component={Profile} />
                            <Route render={() => <h3>No Match</h3>} />
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
};

export default App;
