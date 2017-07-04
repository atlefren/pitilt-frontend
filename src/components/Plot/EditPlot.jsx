import React from 'react';
import moment from 'moment';

import Spinner from '../../helpers/Spinner';
import {getPlot, editPlot} from '../../api';
import PlotSave from './PlotSave';

class EditPlot extends React.Component {

    constructor() {
        super();

        this.state = {
            plot: null
        };
    }

    componentDidMount() {
        var plotId = this.props.match.params.plotId;
        getPlot(plotId, function (err, plot) {
            if (!err) {
                this.setState({
                    plot: plot,
                    loading: false
                });
            }
        }.bind(this));
    }

    render() {
        if (!this.state.plot) {
            return <Spinner />;
        }
        var plot = this.state.plot;
        plot.startTime = moment(plot.startTime, 'YYYY-MM-DDTHH:mm:ssZ');
        return (
            <PlotSave
                legend={`Edit ${this.state.plot.name}`}
                save={editPlot}
                plot={plot} />
        );
    }
};

export default EditPlot;