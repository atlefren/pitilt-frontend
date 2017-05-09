import React from 'react';
import {Route} from 'react-router-dom';

import PlotList from './PlotList';
import PlotDetails from './PlotDetails';
import CreatePlot from './CreatePlot';

export default function (props) {
    var match = props.match;
    return (
        <div>
            <Route path={ `${match.url}/new` }
                   component={ CreatePlot } />
            <Route path={ `${match.url}/:plotId` }
                   component={ PlotDetails } />
            <Route exact
                   path={ match.url }
                   component={ PlotList } />
        </div>
    );
}
