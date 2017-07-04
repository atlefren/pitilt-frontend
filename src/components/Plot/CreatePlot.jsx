import React from 'react';
import moment from 'moment';

import {addPlot} from '../../api';
import PlotSave from './PlotSave';

export default function CreatePlot() {
    var emptyPlot = {
        name: null,
        startTime: moment().startOf('hour'),
        endTime: null,
        instruments: []
    };
    return (
        <PlotSave
            legend="Create New Plot"
            save={addPlot}
            plot={emptyPlot} />
    );
}