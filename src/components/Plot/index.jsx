import React from 'react';
import {Route, Switch} from 'react-router-dom';

import PlotList from './PlotList';
import PlotDetail2 from './PlotDetail2';
import CreatePlot from './CreatePlot';

export default function (props) {
    var match = props.match;
    return (
        <div>
            <Switch>
              <Route path={ `${match.url}/new` }
                     component={ CreatePlot } />
              <Route path={ `${match.url}/:plotId` }
                     component={ PlotDetail2 } />
            </Switch>
            <Route exact
                   path={ match.url }
                   component={ PlotList } />
        </div>
    );
}
