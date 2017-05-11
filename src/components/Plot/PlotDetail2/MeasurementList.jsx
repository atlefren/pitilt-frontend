import React from 'react';
import {Table} from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';

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


class MeasurementList extends React.Component {
    constructor() {
        super();
    }

    render() {
        var headers = this.props.plot.instruments.map(
            instrument => 
            <th key={instrument.key}>{instrument.name}</th>
        );

        return (
            <Table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        {headers}
                    </tr>
                </thead>
                <tbody>
                {this.props.measurements.map(measurement => 
                    <DataRow 
                        data={measurement} 
                        instrumentTypes={this.props.instrumentTypes}
                        instruments={this.props.plot.instruments} 
                        key={measurement.date}/>
                )}
                </tbody>
            </Table>
        );
    }
};

export default MeasurementList;