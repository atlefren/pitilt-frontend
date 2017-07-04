import React from 'react';
import {getKey} from '../../api';
import Spinner from '../../helpers/Spinner';

class ProfilePage extends React.Component {

    state = {loading: true}

    componentDidMount() {
        getKey(function (err, data) {
            this.setState({
                loading: false,
                apikey: data.key
            });
        }.bind(this));
    }

    render() {
        if (this.state.loading) {
            return <Spinner />;
        }
        return (
            <div>
                <h2>Profile</h2>

                <p>Your API-key:</p>
                <pre>
                    {this.state.apikey}
                </pre>
            </div>
        );
    }
}

export default ProfilePage;
