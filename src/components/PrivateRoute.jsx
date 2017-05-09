import React from 'react';
import {Route} from 'react-router-dom'
import * as firebase from 'firebase';

const PrivateRoute = ({component, ...rest}) => (
    <Route {...rest}
           render={ props => (
                    firebase.auth().currentUser != null ? (
                        React.createElement(component, props)
                        ) : (<h2>401: Unauthorized</h2>)
                    ) } />
)

export default PrivateRoute;
