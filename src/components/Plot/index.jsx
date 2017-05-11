import React from 'react';
import {Route, Switch} from 'react-router-dom';

import PlotList from './PlotList';
import PlotDetails from './PlotDetails';
import CreatePlot from './CreatePlot';

export default function (props) {
    var match = props.match;
    return (
        <div>
            <Switch>
              <Route path={ `${match.url}/new` }
                     component={ CreatePlot } />
              <Route path={ `${match.url}/:plotId` }
                     component={ PlotDetails } />
            </Switch>
            <Route exact
                   path={ match.url }
                   component={ PlotList } />
        </div>
    );
}
