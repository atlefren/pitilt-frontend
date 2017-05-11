import React from 'react';
import {Table} from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';

import {getAllDataForPlot, getPlot, getInstrumentTypes} from '../../api';


function formatDate(d) {
    return moment(d).format('DD.MM HH:mm:ss');
}

function DataRow(props) {

    var cols = [];
    cols.push(<td key="date">{formatDate(props.data.date)}</td>)

    cols = cols.concat(props.instruments.map(function(i) {
        var value = props.data.values[i.key];
        var instrumentType = _.find(props.instrumentTypes, instrumentType => instrumentType.key === i.type);
        return <td key={i.key}>{`${value}${instrumentType.symbol}`}</td>
    }));

    return (
        <tr>
        {cols}
        </tr>
    )
}

class PlotDetail2 extends React.Component {

    constructor() {
        super();
        this.state = {
            numWaiting: 3,
            initialData: null
        }
    }

    componentDidMount() {
        var plotId = this.props.match.params.plotId;
        this.setState({numWaiting: 3});
        getAllDataForPlot(plotId, function(err, data){
            if (!err) {
                this.setState({
                    numWaiting: this.state.numWaiting - 1,
                    initialData: data
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

        var headers = this.state.plot.instruments.map(instrument => <th key={instrument.key}>{instrument.name}</th>)
        return (
            <div>
                <h2>{this.state.plot.name}</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            {headers}
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.initialData.map(data => 
                        <DataRow 
                            data={data} 
                            instrumentTypes={this.state.instrumentTypes}
                            instruments={this.state.plot.instruments} 
                            key={data.date}/>
                    )}
                    </tbody>
                </Table>
            </div>
        );
    }

};

export default PlotDetail2;