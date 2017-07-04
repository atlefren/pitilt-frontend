import React from 'react';
import {Table, FormControl, Button, Glyphicon} from 'react-bootstrap';
import _ from 'lodash';


var stamp = (function () {
    var counter = 1;
    return function (element) {
        if (!element._key) {
            element._key = counter;
            counter++;
        }
        return element;
    };
}());

function Instrument(props) {

    var remove = function () {
        props.onRemove(props.instrument);
    };

    var instrumentType = _.find(
        props.instrumentTypes,
        instrumentType => instrumentType.key === props.instrument.type
    );

    return (
        <tr>
            <td>{props.instrument.key}</td>
            <td>{props.instrument.name}</td>
            <td>{instrumentType.name}</td>
            <td>
                <Button bsSize="small"
                    bsStyle="warning"
                    onClick={remove}>
                    <Glyphicon glyph="minus" />
                </Button>
            </td>
        </tr>
    );
}

class InstrumentAdd extends React.Component {

    constructor() {
        super();
        this._onChange = this._onChange.bind(this);
        this._add = this._add.bind(this);
        this.state = {
            name: '',
            type: '',
            key: ''
        };
    }

    render() {

        const enabled = this.state.name !== '' && this.state.type !== '';
        return (
            <tr>
                <td>
                    <FormControl
                        onChange={_.partial(this._onChange, 'key')}
                        value={this.state.key}
                        type='text'/>
                </td>
                <td>
                    <FormControl
                        onChange={_.partial(this._onChange, 'name')}
                        value={this.state.name}
                        type='text'/>
                </td>
                <td>
                    <FormControl
                        onChange={_.partial(this._onChange, 'type')}
                        componentClass="select"
                        value={this.state.type}
                        placeholder="select type">
                        <option value="">...</option>
                        {this.props.instrumentTypes.map(instrumentType =>
                            <option value={instrumentType.key} key={instrumentType.key}>
                                {instrumentType.name}
                            </option>
                        )}
                    </FormControl>
                </td>
                <td>
                    <Button bsSize="small"
                        disabled={!enabled}
                        bsStyle="primary"
                        onClick={this._add}>
                        <Glyphicon glyph="plus" />
                    </Button>
                </td>
            </tr>
        );
    }

    _onChange(key, e) {
        this.setState({[key]: e.target.value});
    }

    _add() {
        this.props.onAdd(_.clone(this.state));
        this.setState({name: '', type: '', key: ''});
    }
};


export default function Instruments(props) {

    var instrumentTypes = props.data;

    function onAdd(instrument) {
        var value = _.clone(props.value);
        value.push(instrument);
        props.onChange(props.element.key, value);
    }

    function onRemove(instrument) {
        var value = _.reject(props.value, i => i._key === instrument._key);
        props.onChange(props.element.key, value);
    }

    const rows = props.value.map(instrument =>
        <Instrument instrument={stamp(instrument)}
            onRemove={onRemove}
            instrumentTypes={instrumentTypes}
            key={stamp(instrument)._key} />
    );

    return (
        <Table>
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {rows}
                <InstrumentAdd onAdd={onAdd} instrumentTypes={instrumentTypes}/>
            </tbody>
        </Table>
    );
}