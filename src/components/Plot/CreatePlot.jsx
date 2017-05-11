import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {Form, Button} from 'react-bootstrap';

import FormElement from './Form/FormElement';
import {addPlot, getInstrumentTypes} from '../../api';

const formatters = {
    datetime: function (value) {
        return value !== null && value !== '' ? moment(value).format("YYYY-MM-DDTHH:mm:ssZ") : null;
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
        key: 'startTime', 
        title: 'Starts at',
        type: 'datetime',
        required: true,
        error: 'Set the start-time'
    },
    {
        key: 'endTime', 
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
        this._gotData = this._gotData.bind(this);
        this.state = {
            loading: true,
            saving: false,
            plot: {name: null, startTime: moment().startOf('hour'), endTime: null, instruments: []},
            errors: []
        }
    }

    componentDidMount() {
        getInstrumentTypes(function(err, instruments){
            if (!err) {
                this._gotData({instruments: instruments});
            }
        }.bind(this));
    }

    render() {
        if (this.state.loading) {
            return <span>Loading</span>;
        }

        return (
            <Form horizontal onSubmit={this._onSubmit}>
             <fieldset>
                <legend>Create New Plot</legend>

                {elements.map(element => (
                    <FormElement
                        element={element}
                        key={element.key}
                        data={this.state.componentData[element.key]}
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

        this.setState({errors: errors});
        if (errors.length === 0) {
            this.setState({saving: true});
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
        console.log("saved", err, resp);
    }

    _gotData(data) {
        this.setState({
            loading: false,
            componentData: data
        });
    }

};

export default CreatePlot;