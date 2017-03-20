import * as firebase from 'firebase';
import reqwest from 'reqwest';

var BASE_URL = 'http://10.0.0.36:8080';

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

function getColors(cb) {
    cb(null, [
        {
            id: 'Black',
            name: 'Black',
            gravity: null,
            temp: null,
            active: false
        },
        {
            id: 'Orange',
            name: 'Orange',
            active: false
        },
        {
            id: 'Green',
            name: 'Green',
            gravity: 1080,
            temp: 18.2,
            active: true,
            updated: '2017-03-20T15:31:16.182000'
        },
        {
            id: 'Blue',
            name: 'Blue',
            active: false
        },
        {
            id: 'Purple',
            name: 'Purple',
            active: false
        },
        {
            id: 'Red',
            name: 'Red',
            gravity: 1200,
            temp: 20.2,
            active: true,
            updated: '2017-03-20T15:38:16.182000'
        },
        {
            id: 'Yellow',
            name: 'Yellow',
            active: false
        },
        {
            id: 'Pink',
            name: 'Pink',
            active: false
        }


    ]);
}


export {getColors, getLatest};
