import React from 'react';
import _ from 'lodash';

import {Link} from 'react-router-dom';


import {getLatest} from '../../api';
import './PlotCard.css';
import dl from '../../helpers/dl';
import formatDate from '../../helpers/formatDate';



class LastMeasurements extends React.Component{

    state = {lastMeasurement: null}

     constructor() {
        super();
        this._getLatest = this._getLatest.bind(this);
    }

    componentDidMount() {
        this._getLatest();
        if (this.props.plot.active) {
            this.interval = setInterval(this._getLatest, 10000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        if (!this.state.lastMeasurement) {
            return <p>No measurements</p>
        }
        var measurements = _.map(this.state.lastMeasurement.values, (value, key) => dl(key, value));
        return (
            <div>
                <p>Last measurement: {formatDate(this.state.lastMeasurement.date, 'DD.MM.YYYY [kl.] HH:mm:ss')}</p>
                <div>{measurements}</div>
            </div>
        );
    }

    _getLatest() {
        getLatest(this.props.plot.id, function (err, data){
            this.setState({lastMeasurement: data});
        }.bind(this));
    }
};

function Content(props) {
    if (!props.plot.active) {
        return (
            <p>Not active</p>
        );
    }
    return (
        <div>
            <p>Started: {formatDate(props.plot.startTime, 'DD.MM.YYYY [kl.] HH:mm:ss')}</p>
        </div>
    );
}

export default function PlotCard(props) {
    return (
        <Link to={ `/plots/${props.plot.id}` }>
            <div className={ 'card ' + (props.plot.id) + ((props.plot.active) ? ' active' : '') }>
                <div className='container'>
                    <h4><b>{ props.plot.name }</b></h4>
                    <Content {...props} />
                    <LastMeasurements plot={props.plot} />
                </div>
            </div>
        </Link>
    );
}
