import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {Form, Button} from 'react-bootstrap';

import FormElement from './Form/FormElement';
import {addPlot} from '../../api';

const formatters = {
    datetime: function (value) {
        return value !== null ? value.toISOString() : null;
    }
}

const validators = {
    text: function (value) {
        return value !== null;
    },
    datetime: function (value) {
        return value !== null;
    },
    instruments: function (value) {
        return value.length > 0;
    }
}

const elements = [
    {
        key: 'name', 
        title: 'Plot Name',
        type: 'text',
        required: true,
        error: 'Set a non-blank name'
    },
    {
        key: 'start_time', 
        title: 'Starts at',
        type: 'datetime',
        required: true,
        error: 'Set the start-time'
    },
    {
        key: 'end_time', 
        title: 'Ends at', 
        type: 'datetime'
    },
    {
        key: 'instruments', 
        title: 'Instruments',
        type: 'instruments',
        required: true,
        error: 'Add at least one instrument'
    }
];

function validate(elements, data) {


    return _.chain(elements)
        .filter(element => element.required)
        .filter(element => !validators[element.type](data[element.key]))
        .map(element => element.key)
        .value();
}

class CreatePlot extends React.Component {

    constructor() {
        super();

        this._onChange = this._onChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._saved = this._saved.bind(this);
        this.state = {
            saving: false,
            plot: {name: null, start_time: moment().startOf('hour'), end_time: null, instruments: []},
            errors: []
        }
    }

    render() { 
        return (
            <Form horizontal onSubmit={this._onSubmit}>
             <fieldset>
                <legend>Create New Plot</legend>

                {elements.map(element => (
                    <FormElement
                        element={element}
                        key={element.key}
                        hasError={this.state.errors.includes(element.key)}
                        onChange={this._onChange}
                        value={this.state.plot[element.key]} />
                ))}
                <Button
                    disabled={this.state.saving}
                    bsStyle="success"
                    type="submit">
                    {this.state.saving ? 'Saving...' : 'Save'}
                </Button>

            </fieldset>
            </Form>
        );
    }

    _onChange(key, value) {
        var data = _.clone(this.state.plot);
        data[key] = value;
        this.setState({plot: data});
    }

    _onSubmit(e) {
        e.preventDefault();
        var errors = validate(elements, this.state.plot);
        console.log(errors)
        this.setState({errors: errors});
        if (errors.length === 0) {
           //this.setState({saving: true});
        this._save();
        }
    }

    _save() {

        var data = _.reduce(this.state.plot, function (acc, value, key) {
            const element = _.find(elements, element => element.key === key);
            acc[key] = _.has(formatters, element.type) ? formatters[element.type](value) : value;
            return acc;
        }, {});

        addPlot(data, this._saved);
    }

    _saved(err, resp) {
        console.log(err, resp);
    }

};

export default CreatePlot;