import React from 'react';
import _ from 'lodash';

import {getColors} from '../../api';
import TiltCard from './TiltCard';


var TiltList = React.createClass({

    getInitialState: function () {

        return {
            tilts: []
        };
    },

    componentDidMount: function () {
        getColors(function (err, colors) {

            if (!err) {
                this.setState({
                    tilts: colors
                });
            }

        }.bind(this));
    },

    render: function () {
        if (!this.state.tilts.length) {
            return <span>Venter</span>;
        }
        return <div className='tilt-cards'>
            {_.chain(this.state.tilts)
                .sortBy(function (item) {
                    return item.active ? -1 : 1;
                })
                .map(function (tilt) {
                    return <TiltCard key={tilt.id} tilt={tilt}/>;
                })
                .value()
            }
        </div>;
    }
});


export default TiltList;
