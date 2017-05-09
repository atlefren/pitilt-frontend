import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router-dom';

import {getPlots} from '../../api';
import PlotCard from './PlotCard';



var PlotList = React.createClass({

    getInitialState: function () {

        return {
            plots: null
        };
    },

    componentDidMount: function () {
        getPlots(function (err, plots) {
            if (!err) {
                this.setState({
                    plots: plots
                });
            }
        }.bind(this));
    },

    render: function () {
        if (this.state.plots === null) {
            return (
                <span>Waiting</span>
            );

        }
        if (this.state.plots.length === 0) {
            return (
                <span>No plots</span>
            );
        }
        return (
            <div className='plot-cards'>
                    {
                    _.chain(this.state.plots)
                        .sortBy(function (item) {
                            return item.active ? -1 : 1;
                        })
                        .map(function (plot) {
                             return (
                                <PlotCard key={ plot.id }
                                          plot={ plot } />
                            );
                        })
                        .value()
                    }
            </div>
        );
    }
});


export default function PlotListContainer(props) {
    return (
        <div>
            <PlotList {...props} />
            <div>
                <Link className="btn btn-primary" to={ `/plots/new` }>Create New Plot</Link>
            </div>
        </div>
    );
};
