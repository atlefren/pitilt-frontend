import React from 'react';
import _ from 'lodash';
import {Nav, NavItem} from 'react-bootstrap';

import {getAllDataForPlot, getPlot, getInstrumentTypes, getMeasurementsSince, getLatest} from '../../../api';
import MeasurementList from './MeasurementList';
import MeasurementGraph from './MeasurementGraph';
import Spinner from '../../../helpers/Spinner';
import dl from '../../../helpers/dl';
import formatDate from '../../../helpers/formatDate';


function sortMeasurements(a, b) {
    var dateA = a.date;
    var dateB = b.date;
    if (dateA < dateB) {
        return 1;
    }
    if (dateA > dateB) {
        return -1;
    }
    return 0;
}


function mergeData(measurement, instruments, instrumentTypes) {
    return _.map(instruments, function (instrument) {
        const instrumentType = _.find(instrumentTypes, it => it.key === instrument.type);
        return {
            name: instrument.name,
            value: measurement.values[instrument.key],
            instrumentType: instrumentType
        }
    });
}


function ViewChooser(props) {
    return (
        <Nav bsStyle="tabs" activeKey={props.selectedView} onSelect={props.handleSelect}>
            <NavItem eventKey="graph">Graph</NavItem>
            <NavItem eventKey="list">List</NavItem>
        </Nav>
    );
}


class PlotDetail2 extends React.Component {

    constructor() {
        super();
        this._getLatest = this._getLatest.bind(this);
        this._changeView = this._changeView.bind(this);
        this.state = {
            numWaiting: 3,
            measurements: [],
            lastMeasurement: null,
            noMeasurements: false,
            selectedView: 'graph'
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidMount() {
        var plotId = this.props.match.params.plotId;
        this.setState({numWaiting: 3});

        getLatest(plotId, function(err, data){

            if (err) {
                this.setState({noMeasurements: true});
                return;
            }
            this.setState({
                numWaiting: this.state.numWaiting - 1,
                lastMeasurement: data
            });
        }.bind(this));

        getInstrumentTypes(function(err, data){
            if (!err) {
                this.setState({
                    numWaiting: this.state.numWaiting - 1,
                    instrumentTypes: data
                });
            }
        }.bind(this));

        getPlot(plotId, function(err, plot){
            if (!err) {
                this.setState({
                    numWaiting: this.state.numWaiting - 1,
                    plot: plot
                });
            }
        }.bind(this));

        getAllDataForPlot(plotId, function(err, data){
            if (!err) {
                this.setState({
                    //we do not wait for this..
                    measurements: data.sort(sortMeasurements)
                });
            }
        }.bind(this));

        this.interval = setInterval(this._getLatest, 10000);
    }

    _getLatest() {
        if (this.state.plot.active && this.state.measurements.length) {
            getMeasurementsSince(this.props.match.params.plotId, this.state.lastMeasurement.date, function (err, measurements) {
                this.setState({
                    lastMeasurement: measurements[0],
                    measurements: measurements.concat(this.state.measurements)
                })
            }.bind(this));
        }
    }

    render() {
        if (this.state.noMeasurements) {
            return (
                <p>No measurements</p>
            );
        }
        if (this.state.numWaiting > 0) {
            return (
                <Spinner/>
            );
        }

        var view; 
        if (this.state.selectedView === 'graph') {
            view = (
                <MeasurementGraph
                        measurements={this.state.measurements}
                        instrumentTypes={this.state.instrumentTypes}
                        plot={this.state.plot} />
            );
        }
        if (this.state.selectedView === 'list') {
            view = (
                <MeasurementList
                    measurements={this.state.measurements}
                    instrumentTypes={this.state.instrumentTypes}
                    plot={this.state.plot} />
            );
        }

        var last = mergeData(this.state.lastMeasurement, this.state.plot.instruments, this.state.instrumentTypes)
        return (
            <div>
                <h2>{this.state.plot.name}</h2>
                <div>
                    {dl('Last updated', formatDate(this.state.lastMeasurement.date))}
                    {_.map(last, (m) => dl(`Current ${m.name}`, `${m.value}${!!m.instrumentType.symbol ? m.instrumentType.symbol : ''}`))}
                </div>
                <ViewChooser
                    handleSelect={this._changeView}
                    selectedView={this.state.selectedView} />
                {view}
            </div>
        );
    }

    _changeView(view) {
        this.setState({selectedView: view});
    }

};

export default PlotDetail2;