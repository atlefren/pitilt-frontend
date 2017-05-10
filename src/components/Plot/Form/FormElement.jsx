import React from 'react';
import {FormControl, FormGroup, ControlLabel, Col, HelpBlock} from 'react-bootstrap';

import Input from './Input';
import DateTime from './DateTime';
import Instruments from './Instruments';

const types = {
    text: Input,
    datetime: DateTime,
    instruments: Instruments
};


export default function FormElement(props) {

    var CustomInput = types[props.element.type];
    var helpBlock = null;
    if (props.hasError) {
        helpBlock = (
            <HelpBlock>{props.element.error}</HelpBlock>
        );
    }
    return (
        <FormGroup
            validationState={props.hasError ? 'error': null}
            controlId={props.element.key}>
            <Col xs={6} md={2}>
                <ControlLabel htmlFor={props.element.key}>
                    {props.element.title}
                </ControlLabel>
            </Col>
            <Col xs={6} md={8}>
                <CustomInput {...props} />
                {helpBlock}
            </Col>
        </FormGroup>
    );
}

