'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _require = require('../utils/razorpay-utils'),
    normalizeNotes = _require.normalizeNotes;

module.exports = function (api) {

    var BASE_URL = "/accounts";

    return {
        create: function create(params, callback) {
            var notes = params.notes,
                rest = _objectWithoutProperties(params, ['notes']);

            var data = Object.assign(rest, normalizeNotes(notes));

            return api.post({
                version: 'v2',
                url: '' + BASE_URL,
                data: data
            }, callback);
        },
        edit: function edit(accountId, params, callback) {
            var notes = params.notes,
                rest = _objectWithoutProperties(params, ['notes']);

            var data = Object.assign(rest, normalizeNotes(notes));

            return api.patch({
                version: 'v2',
                url: BASE_URL + '/' + accountId,
                data: data
            }, callback);
        },
        fetch: function fetch(accountId, callback) {
            return api.get({
                version: 'v2',
                url: BASE_URL + '/' + accountId
            }, callback);
        },
        delete: function _delete(accountId, callback) {
            return api.delete({
                version: 'v2',
                url: BASE_URL + '/' + accountId
            }, callback);
        },
        uploadAccountDoc: function uploadAccountDoc(accountId, params, callback) {
            return api.post({
                version: 'v2',
                url: BASE_URL + '/' + accountId + '/documents',
                formData: params
            }, callback);
        },
        fetchAccountDoc: function fetchAccountDoc(accountId, callback) {
            return api.get({
                version: 'v2',
                url: BASE_URL + '/' + accountId + '/documents'
            }, callback);
        }
    };
};