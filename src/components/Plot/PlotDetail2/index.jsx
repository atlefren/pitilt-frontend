import React from 'react';
import _ from 'lodash';
import {Nav, NavItem} from 'react-bootstrap';
import moment from 'moment';

import {getPlot, getInstrumentTypes, getMeasurementsSince, getLatest} from '../../../api';
import MeasurementList from './MeasurementList';
import MeasurementGraph from './MeasurementGraph';
import Spinner from '../../../helpers/Spinner';
import dl from '../../../helpers/dl';
import formatDate from '../../../helpers/formatDate';
import MeasurementLoader from './MeasurementLoader';




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

function PeriodChooser(props) {
    return (
        <Nav bsStyle="pills" activeKey={props.selectedPeriod} onSelect={props.handleSelect}>
            <NavItem eventKey="day">Last Day</NavItem>
            <NavItem eventKey="week">Last Week</NavItem>
            <NavItem eventKey="all">All Measurements</NavItem>
        </Nav>
    );
}

const resolutions = {
    'day': 'minute',
    'week': 'hour',
    'all': 'day'
}


class PlotDetail2 extends React.Component {

    constructor() {
        super();
        this._getLatest = this._getLatest.bind(this);
        this._changeView = this._changeView.bind(this);
        this._calculatePeriod = this._calculatePeriod.bind(this);
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
            this._calculatePeriod();

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
                this._calculatePeriod();
            }
        }.bind(this));

        /*
        getAllDataForPlot(plotId, function(err, data){
            if (!err) {
                this.setState({
                    //we do not wait for this..
                    measurements: data.sort(sortMeasurements)
                });
            }
        }.bind(this));
        */

        //this.interval = setInterval(this._getLatest, 10000);
    }


    _calculatePeriod(timeSpan) {
        if (!this.state.plot || !this.state.lastMeasurement) {
            return;
        }
        if (!timeSpan) {
            timeSpan = this.state.plot.active ? 'day' : 'all';
        }

        console.log(timeSpan)

        var plotParams = this._getPlotParams(this.state.plot.startTime, this.state.lastMeasurement.date, timeSpan);
        console.log(plotParams);

        this.setState({
            timeSpan: timeSpan,
            timeOffset: 0,
            plotParams: plotParams
        });
    }


    _getPlotParams(start, end, timeSpan) {

        if (timeSpan !== 'all') {
            start = moment(end).startOf(timeSpan);
        }

        return {
            resolution: resolutions[timeSpan],
            start: moment(start).format(),
            end: moment(end).format()
        };
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
        if (this.state.numWaiting > 0 || !this.state.plotParams) {
            return (
                <Spinner/>
            );
        }

        var view; 
        if (this.state.selectedView === 'graph') {
            view = (
                <MeasurementLoader 
                    instrumentTypes={this.state.instrumentTypes}
                    plotParams={this.state.plotParams}
                    plot={this.state.plot}>
                    <MeasurementGraph />
                </MeasurementLoader>
            );
        }
        if (this.state.selectedView === 'list') {
            view = (
                <MeasurementLoader 
                    instrumentTypes={this.state.instrumentTypes}
                    plotParams={this.state.plotParams}
                    plot={this.state.plot}>
                    <MeasurementList />
                </MeasurementLoader>
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
                <PeriodChooser 
                    handleSelect={this._calculatePeriod} 
                    selectedPeriod={this.state.timeSpan} />
                {view}
            </div>
        );
    }

    _changeView(view) {
        this.setState({selectedView: view});
    }

};

export default PlotDetail2;