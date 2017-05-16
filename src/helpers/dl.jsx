import React from 'react';

export default function dl(dt, dd) {
    return (
        <dl key={ dt } className="dl-horizontal">
            <dt>{ dt }</dt>
            <dd>
                { dd }
            </dd>
        </dl>
    );
}