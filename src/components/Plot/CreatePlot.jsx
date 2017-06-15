import React from 'react';
import moment from 'moment';
import {Redirect} from 'react-router-dom'
import {addPlot} from '../../api';
import PlotSave from './PlotSave';

export default function CreatePlot(props) {
    return (
        <PlotSave
            legend="Create New Plot"
            save={addPlot}
            plot={{name: null, startTime: moment().startOf('hour'), endTime: null, instruments: []}} />
    );
}