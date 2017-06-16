import React from 'react';

export default function dl(dt, dd) {
    return (
        <dl key={ dt }>
            <dt>{ dt }</dt>
            <dd>
                { dd }
            </dd>
        </dl>
    );
}