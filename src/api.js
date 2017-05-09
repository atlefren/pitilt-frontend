import * as firebase from 'firebase';
import reqwest from 'reqwest';


var BASE_URL = process.env.REACT_APP_API_BASE;

function sendRequest(method, url, data, cb) {
    firebase.auth().currentUser.getToken(false).then(function (idToken) {
        reqwest({
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
        });

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


export {getPlots, getLatest, getAllDataForPlot, getHourlyDataForPlot, getPlot};
