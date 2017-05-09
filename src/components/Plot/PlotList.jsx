import React from 'react';
import _ from 'lodash';

import {getPlots} from '../../api';
import PlotCard from './PlotCard';


var PlotList = React.createClass({

    getInitialState: function () {

        return {
            plots: []
        };
    },

    componentDidMount: function () {
        console.log('a')
        getPlots(function (err, plots) {
            console.log('b')
            if (!err) {
                this.setState({
                    plots: plots
                });
            }

        }.bind(this));
    },

    render: function () {
        if (!this.state.plots.length) {
            return <span>Venter</span>;
        }
        return <div className='plot-cards'>
                   { _.chain(this.state.plots)
                         .sortBy(function (item) {
                             return item.active ? -1 : 1;
                         })
                         .map(function (plot) {
                             return <PlotCard key={ plot.id }
                                              plot={ plot } />;
                         })
                         .value() }
               </div>;
    }
});


export default PlotList;
