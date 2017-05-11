import React from 'react';
import {getAllDataForPlot, getPlot, getInstrumentTypes} from '../../../api';
import MeasurementList from './MeasurementList';





class PlotDetail2 extends React.Component {

    constructor() {
        super();
        this.state = {
            numWaiting: 3,
            measurements: null
        }
    }

    componentDidMount() {
        var plotId = this.props.match.params.plotId;
        this.setState({numWaiting: 3});
        getAllDataForPlot(plotId, function(err, data){
            if (!err) {
                this.setState({
                    numWaiting: this.state.numWaiting - 1,
                    measurements: data
                });
            }
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
    }

    render() {
        if (this.state.numWaiting > 0) {
            return <span>loading</span>
        }
        return (
            <div>
                <h2>{this.state.plot.name}</h2>
                <MeasurementList
                    measurements={this.state.measurements}
                    instruments={this.state.instruments}
                    instrumentTypes={this.state.instrumentTypes}
                    plot={this.state.plot} />
            </div>
        );
    }

};

export default PlotDetail2;