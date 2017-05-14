import React from 'react';
import * as firebase from 'firebase';
import {Redirect} from 'react-router-dom'


class Login extends React.Component {

    state = {
        redirectToReferrer: false
    }

    componentDidMount() {
        if (firebase.auth().currentUser !== null) {
            this.logout();
        }
        this.removeListener = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.setState({
                    redirectToReferrer: true
                });
            }
        });
    }

    componentWillUnmount () {
        this.removeListener()
    }

    logout() {
        firebase.auth().signOut();
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } }
        const { redirectToReferrer } = this.state

        if (redirectToReferrer) {
            return (
                <Redirect to={from}/>
            )
        }
        return null;
    }
}

export default Login;