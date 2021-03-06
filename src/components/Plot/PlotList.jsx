import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router-dom';

import {getPlots} from '../../api';
import PlotCard from './PlotCard';
import Spinner from '../../helpers/Spinner';


class PlotList extends React.Component {

     constructor() {
        super();

        this.state = {
            plots: null
        };
    }

    componentDidMount() {
        getPlots(function (err, plots) {
            if (!err) {
                this.setState({
                    plots: plots
                });
            }
        }.bind(this));
    }

    render() {
        if (this.state.plots === null) {
            return (
                <Spinner />
            );

        }
        if (this.state.plots.length === 0) {
            return (
                <span>No plots</span>
            );
        }
        return (
            <div className='plot-cards clearfix'>
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
}


export default function PlotListContainer(props) {
    return (
        <div>
            <PlotList {...props} />
            <hr />
            <div>
                <Link className="btn btn-primary" to={'/plots/new'}>Create New Plot</Link>
            </div>
        </div>
    );
};
