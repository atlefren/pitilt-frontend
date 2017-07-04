import React from 'react';
import {getDataForPlot} from '../../../api';
import Spinner from '../../../helpers/Spinner';

class MeasurementLoader extends React.Component {

     constructor() {
        super();
        this.state = {
            measurements: null
        };
    }

    componentDidMount() {
       this._loadMeasurements();
    }

    _loadMeasurements() {
        this.setState({measurements: null});
        getDataForPlot(this.props.plot.id, this.props.plotParams, function(err, data){
            if (!err) {
                this.setState({
                    measurements: data
                });
            }
        }.bind(this));
        
    }

    componentDidUpdate(nextProps) {
        if (JSON.stringify(this.props.plotParams) === JSON.stringify(nextProps.plotParams)) {
            return;
        }
        this._loadMeasurements();
    }

    render () {
        if (!this.state.measurements) {
            return <Spinner />;
        }
        if (this.state.measurements.length === 0) {
            return <div>No data</div>;
        }
        return React.cloneElement(
            this.props.children,
            {...this.props, measurements: this.state.measurements}
        );

    }
}

export default MeasurementLoader;