import React from 'react';
import {formatTemp, formatGravity} from '../../util';

import './TiltCard.css';

function Content(props) {
    if (!props.tilt.active) {
        return <p>No recent measurements</p>;
    }
    return (
        <div>
        <p>Specific gravity</p>
        <p className='header'>{formatGravity(props.tilt.gravity)}</p>
        <p>Temperature:</p>
        <p className='header'>{formatTemp(props.tilt.temp, 'c')}</p>
        <p>{props.tilt.updated}</p>
        </div>
    );
}

export default function TiltCard(props) {
    return (
        <a href='#'>
            <div
        onClick={console.log}
        className={'card ' + (props.tilt.id) + ((props.tilt.active) ? ' active' : '')}>
              <div className='container'>
                <h4><b>{props.tilt.name}</b></h4>
                <Content {...props} />
              </div>
            </div>
        </a>
    );
}
