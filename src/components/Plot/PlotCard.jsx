import React from 'react';
import {formatTemp, formatGravity} from '../../util';
import _ from 'lodash';
import moment from 'moment';

import './PlotCard.css';
import {Link} from 'react-router-dom';

function dl(dt, dd) {
    return (
        <dl key={ dt }>
            <dt>{ dt }</dt>
            <dd>
                { dd }
            </dd>
        </dl>
    );
}


var renderers = {
    temperature_celsius: function (data) {
        return dl('Temperature', formatTemp(data, 'c'));
    },
    gravity: function (data) {
        return dl('Specific Gravity', formatGravity(data));
    }
};


function Content(props) {
    if (!props.plot.active) {
        return (<p>
                    No recent measurements
                </p>);
    }

    var measurements = _.chain(props.plot.instruments)
        .filter(instrument => _.has(renderers, instrument.type))
        .map(instrument => renderers[instrument.type](props.plot.data.values[instrument.name]))
        .value();

    return (
        <div>
            { measurements }
            <p>
                { moment(props.plot.data.date).format('DD.MM.YYYY [kl.] HH:mm:ss') }
            </p>
        </div>
    );
}

export default function PlotCard(props) {
    return (
        <Link to={ `/plots/${props.plot.id}` }>
        <div className={ 'card ' + (props.plot.id) + ((props.plot.active) ? ' active' : '') }>
            <div className='container'>
                <h4><b>{ props.plot.name }</b></h4>
                <Content {...props} />
            </div>
        </div>
        </Link>
    );
}
