import React from 'react';
import Datetime from 'react-datetime';

import 'react-datetime/css/react-datetime.css';

export default function DateTime(props) {

    var onChange = function (value) {
        props.onChange(props.element.key, value);
    };

    return (
        <Datetime
            dateFormat='DD.MM.YYYY'
            timeFormat='HH:mm'
            onChange={onChange}
            value={props.value}/>
    );
}