import React from 'react';
import {Table} from 'react-bootstrap';
import _ from 'lodash';

import Spinner from '../../../helpers/Spinner';
import formatDate from '../../../helpers/formatDate';


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



export default function MeasurementList(props) {
    var headers = props.plot.instruments.map(
        instrument => 
        <th key={instrument.key}>{instrument.name}</th>
    );
    var measurements = props.measurements.sort(sortMeasurements);
    return (
        <Table>
            <thead>
                <tr>
                    <th>Timestamp</th>
                    {headers}
                </tr>
            </thead>
            <tbody>
            {measurements.map(measurement => 
                <DataRow 
                    data={measurement} 
                    instrumentTypes={props.instrumentTypes}
                    instruments={props.plot.instruments} 
                    key={measurement.date}/>
            )}
            </tbody>
        </Table>
    );
}

