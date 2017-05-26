import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import moment from 'moment';
import _ from 'lodash';

import Spinner from '../../../helpers/Spinner';

const CustomizedAxisTick = React.createClass({
    render() {
        const {x, y, payload} = this.props;
        return (
            <g transform={ `translate(${x},${y})` }>
                <text x={ 0 }
                      y={ 0 }
                      dy={ 16 }
                      textAnchor='end'
                      fill='#666'
                      transform='rotate(-35)'>
                    { formatDate(payload.value) }
                </text>
            </g>
        );
    }
});

function sortMeasurements(a, b) {
    var dateA = a.timestamp;
    var dateB = b.timestamp;
    if (dateA < dateB) {
        return -1;
    }
    if (dateA > dateB) {
        return 1;
    }
    return 0;
}

function formatDate(d) {
    return moment(d).format('DD.MM HH:mm');
}

function formatData(measurements) {
    return _.map(measurements, function (measurement) {
        return _.assign({
            timestamp: measurement.date
        }, measurement.values)
    }).sort(sortMeasurements);
}

const getColor = (function() {

    const colors = [
        '#e31a1c',
        '#ff7f00',
        '#1f78b4',
        '#33a02c',
        '#fb9a99',
        '#a6cee3',
        '#fdbf6f',
        '#b2df8a',
        '#cab2d6'
    ]

    return function () {
        return colors.shift();
    }
}());

function getAxes(instruments) {

    return _.flatten(_.map(instruments, function (instrument, i) {
        return [
            (<YAxis 
                yAxisId='left'
                key={`${instrument.key}_axis`}
                orientation='left' />),
            (<Line type='linear'
                dot={false}
                isAnimationActive ={false}
                key={`${instrument.key}_line`}
                name={instrument.name}
                yAxisId='left'
                dataKey={instrument.key}
                stroke={instrument.color} />)
        ];
    }));
}


class MeasurementGraph extends React.Component {

    render() {

        var chartComponents = [

            (<XAxis dataKey='timestamp'
                   minTickGap={ 10 }
                   key='XAxis'
                   tick={ <CustomizedAxisTick/> }
                   interval="preserveStartEnd" />),

            (<CartesianGrid key='grid'
                            strokeDasharray='3 3' />),
            (<Tooltip key='tooltip'
                      labelFormatter={ formatDate } />),
            (<Legend key='legend'
                     verticalAlign='top' />)
        ].concat(getAxes(this.props.instruments));

        const data = formatData(this.props.measurements);

        return (
            <div>
                <ResponsiveContainer 
                    width={ '100%' }
                    height={ 500 }>
                    <LineChart
                        data={ data }
                        margin={{top: 20, right: 30, left: 20, bottom: 50}}>
                        {chartComponents}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}


function MeasurementGraphs(props) {
    if (!props.measurements.length) {
        return <Spinner />;
    }
    var graphs = _.map(props.plot.instruments, function (instrument) {
        if (!instrument.color) {
            instrument.color = getColor();
        }
        return (
            <div key={instrument.key} >
                <h3>{instrument.name}</h3>
                <MeasurementGraph instruments={[instrument]} measurements={props.measurements}/>
            </div>
        )
    });

    return (
        <div>
            {graphs}
        </div>
    );
}

export default MeasurementGraphs;


