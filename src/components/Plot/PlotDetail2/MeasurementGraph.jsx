import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import moment from 'moment';
import _ from 'lodash';

function CustomizedAxisTick(props) {
    const {x, y, payload} = props;
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

function CustomizedYAxisTick(props) {
    const {x, y, payload} = props;
    const unit = !_.isNil(props.unit) ? props.unit : '';
    return (
        <g transform={ `translate(${x},${y})` }>
            <text x={ 0 }
                  y={ 0 }
                  dy={ 10 }
                  dx={props.pos === 'left' ? -10: 10}
                  textAnchor={props.pos === 'left' ? 'end': 'start'}
                  fill='#666'>
                {`${payload.value}${unit}`}
            </text>
        </g>
    );
}

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

function generateAxis(axis) {
    var minValue = !_.isNil(axis.minValue) ? axis.minValue : 'auto';
    var maxValue = !_.isNil(axis.maxValue) ? axis.maxValue : 'auto';
    return (
        <YAxis 
            label={axis.label}
            yAxisId={axis.id}
            interval={0}
            domain={[minValue, maxValue]}
            tick={ <CustomizedYAxisTick pos={axis.id} unit={axis.unit}/> }
            key={`${axis.id}_axis`}
            orientation={axis.id} />
    );
}

function generateLine(instrument) {
    return (
        <Line type='linear'
            dot={false}
            isAnimationActive={false}
            key={`${instrument.key}_line`}
            name={instrument.name}
            yAxisId={instrument.axis}
            dataKey={instrument.key}
            stroke={instrument.color} />
    );
}

function MeasurementGraph(props) {

    //TODO: handle degF, weird fucking americans
    var axes = [
        {
            label: 'Temperature',
            id: 'left',
            unit: '°C',
            minValue: 0,
            maxValue: 'dataMax + 5',
            types: ['degC']
        },
        {
            label: 'Gravity',
            id: 'right',
            minValue: 1000,
            maxValue: 'dataMax + 10',
            types: ['gravity']
        }
    ];

    const data = formatData(props.measurements.sort(sortMeasurements));

    const instruments = _.map(props.plot.instruments, function (instrument) {
        if (!instrument.color) {
            instrument.color = getColor();
        }
        var axis = _.find(axes, a => a.types.indexOf(instrument.type) > -1);
        if (!axis) {
            return null;
        }
        instrument.axis = axis.id;
        return instrument;
    });

    const chartComponents = [
        (<XAxis dataKey='timestamp'
               minTickGap={ 10 }
               key='XAxis'
               tick={ <CustomizedAxisTick/> }
               interval="preserveStartEnd" />),
        (<CartesianGrid key='grid' strokeDasharray='3 3' />),
        (<Tooltip key='tooltip' labelFormatter={ formatDate } />),
        (<Legend key='legend' verticalAlign='top' />)]
        .concat(_.map(axes, generateAxis))
        .concat(_.map(_.compact(instruments), generateLine));


    return (
        <div>
            <ResponsiveContainer 
                width={ '100%' }
                height={ 500 }>
                <LineChart
                    data={data}
                    margin={{top: 20, right: 30, left: 20, bottom: 50}}>
                    {chartComponents}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MeasurementGraph;


