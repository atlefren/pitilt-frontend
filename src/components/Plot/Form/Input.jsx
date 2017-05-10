import React from 'react';

import {FormControl} from 'react-bootstrap';

export default function  Input(props) {

    var onChange = function (e) {
        const value = e.target.value;
        props.onChange(props.element.key, value);
    };

    return (
        <FormControl
            onChange={onChange}
            value={props.value === null ? '' : props.value}
            type={props.element.type}/>
    );
}