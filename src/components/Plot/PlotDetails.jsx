import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import moment from 'moment';
import _ from 'lodash';

import {getPlot, getHourlyDataForPlot} from '../../api';


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

function formatDate(d) {
    return moment(d).format('DD.MM HH:mm');
}



function formatData(measurements) {


    return _.map(measurements, function (measurement) {
        return _.assign({
            timestamp: measurement.date
        }, measurement.values);
    });

}

/*
<YAxis yAxisId='left'
                                  domain={ [1000, 'dataMax+10'] }
                                  orientation='left'
                                  stroke='#8884d8' />
                           <YAxis yAxisId='right'
                                  domain={ ['dataMin-5', 'dataMax+5'] }
                                  orientation='right'
                                  stroke='#82ca9d' />
                           <Line type='linear'
                                 dot={ false }
                                 name='Specific gravity'
                                 yAxisId='left'
                                 dataKey='tilt_gravity'
                                 stroke='#8884d8' />
                           <Line type='linear'
                                 dot={ false }
                                 name='Temperature'
                                 unit='°C'
                                 yAxisId='right'
                                 dataKey='tilt_temp'
                                 stroke='#82ca9d' />
*/

function getAxes(instruments) {
    return [];
    return _.flatten(_.map(instruments, function (instrument) {
        return [
            (<YAxis yAxisId='left'
                    domain={ [1000, 'dataMax+10'] }
                    orientation='left'
                    stroke='#8884d8' />),
            (<Line type='linear'
                   dot={ false }
                   name='Specific gravity'
                   yAxisId='left'
                   dataKey='tilt_gravity'
                   stroke='#8884d8' />)
        ]
    }));

}


var Graph = React.createClass({

    getInitialState: function () {
        return {
            data: null,
            isLoading: true
        };
    },

    componentDidMount: function () {
        getHourlyDataForPlot(this.props.plotId, function (err, data) {
            if (!err) {
                this.setState({
                    data: data,
                    isLoading: false
                });
            } else {
                this.setState({
                    error: err,
                    isLoading: false
                });
            }

        }.bind(this));
    },

    render: function () {
        if (this.state.isLoading) {
            return <span>Loading</span>;
        }
        if (!this.state.data.length) {
            return <span>No data</span>;
        }

        var chartComponents = [
            (
            <XAxis dataKey='timestamp'
                   minTickGap={ 10 }
                   key='XAxis'
                   tick={ <CustomizedAxisTick/> }
                   interval={ 10 } />),

            (<CartesianGrid key='grid'
                            strokeDasharray='3 3' />),
            (<Tooltip key='tooltip'
                      labelFormatter={ formatDate } />),
            (<Legend key='legend'
                     verticalAlign='top' />)
        ].concat(getAxes(this.props.instruments));

        console.log(chartComponents)

        return <div>
                   <ResponsiveContainer width={ '100%' }
                                        height={ 500 }>
                       <LineChart data={ formatData(this.state.data) }
                                  margin={ { top: 20, right: 30, left: 20, bottom: 50 } }>
                           { chartComponents }
                       </LineChart>
                   </ResponsiveContainer>
               </div>;
    }
});


var PlotDetail = React.createClass({

    getInitialState: function () {
        return {
            plot: null,
            isLoading: true
        };
    },

    componentDidMount: function () {
        getPlot(this.props.match.params.plotId, function (err, plot) {
            if (!err) {
                console.log(plot);
                this.setState({
                    plot: plot,
                    isLoading: false
                });
            } else {
                this.setState({
                    error: err,
                    isLoading: false
                });
            }

        }.bind(this));
    },

    render: function () {
        if (this.state.isLoading) {
            return <span>Loading</span>;
        }
        return (
            <div>
                <h3>{ this.state.plot.name }</h3>
                <Graph instruments={ this.state.plot.instruments }
                       plotId={ this.props.match.params.plotId } />
            </div>
        );

    }
});

export default PlotDetail;
