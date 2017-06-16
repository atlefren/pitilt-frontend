import React from 'react';
import {getAllDataForPlot} from '../../../api';
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
        if (this.props.plotParams.resolution !== 'minute') {
            this.setState({
                    measurements: []
                });
            return;
        }
        this.setState({measurements: null});
        getAllDataForPlot(this.props.plot.id, this.props.plotParams, function(err, data){
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
        if (this.props.plotParams.resolution !== 'minute') {
            return <div>Coming soon</div>;
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