import React from 'react';
import {FormGroup, ControlLabel, Col, HelpBlock} from 'react-bootstrap';

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
            <Col md={4}>
                <ControlLabel htmlFor={props.element.key}>
                    {props.element.title}
                </ControlLabel>
            </Col>
            <Col md={8}>
                <CustomInput {...props} />
                {helpBlock}
            </Col>
        </FormGroup>
       
    );
}

