import * as firebase from 'firebase';
import reqwest from 'reqwest';


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
        console.log(props);
        reqwest(props);

    }).catch(function (err) {
        cb(err);
    });
}


function getLatest(color, cb) {
    sendRequest('GET', '/data/latest/' + color, null, cb);
}

function getAllDataForPlot(plotId, cb) {
    sendRequest('GET', `/plots/${plotId}/data/all/`, null, cb);
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

function getInstrumentTypes(cb) {
    cb(null, [
        {'key': 'degC', 'name': 'Degrees Celcius', 'symbol': '°C'},
        {'key': 'degF', 'name': 'Degrees Farenheit', 'symbol': '°F'},
        {'key': 'gravity', 'name': 'Gravity', 'symbol': ''}
    ]);
}


export {
    getPlots,
    getPlot,
    addPlot,
    getLatest,
    getAllDataForPlot,
    getHourlyDataForPlot,
    getInstrumentTypes
};
