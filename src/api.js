import * as firebase from 'firebase';
import reqwest from 'reqwest';
import _ from 'lodash';

var BASE_URL = process.env.REACT_APP_API_BASE;

function sendRequest(method, url, data, cb) {
    firebase.auth().currentUser.getToken(false).then(function (idToken) {

        var props = {
            url: BASE_URL + url,
            crossOrigin: true,
            type: 'json',
            method: method,
            contentType: 'application/json; charset=utf-8',
            headers: {
                'Authorization': 'Bearer ' + idToken
            },
            error: function (err) {
                cb(err);
            },
            success: function (resp) {
                cb(null, resp);
            }
        };
        if (data !== null) {
            props.data = JSON.stringify(data);
        }
        reqwest(props);

    }).catch(function (err) {
        cb(err);
    });
}

function getQueryParams(params) {
    return _.map(params, (value, key) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
}

function getLatest(plotId, cb) {
    sendRequest('GET', `/plots/${plotId}/data/latest/`, null, cb);
}

function getAllDataForPlot(plotId, params, cb) {
    const url = `/plots/${plotId}/data/all/?${getQueryParams(params)}`;
    console.log(url);
    sendRequest('GET', url, null, cb);
}

function getHourlyDataForPlot(plotId, cb) {
    sendRequest('GET', `/plots/${plotId}/data/hourly/`, null, cb);
}

function getPlot(plotId, cb) {
    sendRequest('GET', `/plots/${plotId}`, null, cb);
}

function getPlots(cb) {
    sendRequest('GET', '/plots/', null, cb);
}

function addPlot(data, cb) {
    sendRequest('POST', '/plots/', data, cb);
}

function getKey(cb) {
    sendRequest('GET', '/user/key/', null, cb);
}

function getInstrumentTypes(cb) {
    //TODO: get from server
    cb(null, [
        {'key': 'degC', 'name': 'Degrees Celcius', 'symbol': '°C'},
        {'key': 'degF', 'name': 'Degrees Farenheit', 'symbol': '°F'},
        {'key': 'gravity', 'name': 'Gravity', 'symbol': ''}
    ]);
}

function getMeasurementsSince(plotId, since, cb) {
    //TODO: get from correct server method
    getLatest(plotId, function (err, data) {
        cb(err, [data]);
    });
}


export {
    getPlots,
    getPlot,
    addPlot,
    getLatest,
    getAllDataForPlot,
    getHourlyDataForPlot,
    getInstrumentTypes,
    getKey,
    getMeasurementsSince
};
