'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _require = require('../utils/razorpay-utils'),
    normalizeNotes = _require.normalizeNotes;

module.exports = function (api) {

    var BASE_URL = "/tokens";

    return {
        create: function create(params, callback) {
            var notes = params.notes,
                rest = _objectWithoutProperties(params, ['notes']);

            var data = Object.assign(rest, normalizeNotes(notes));

            return api.post({
                url: '' + BASE_URL,
                data: data
            }, callback);
        },
        fetch: function fetch(params, callback) {
            return api.post({
                url: BASE_URL + '/fetch',
                data: params
            }, callback);
        },
        delete: function _delete(params, callback) {
            return api.post({
                url: BASE_URL + '/delete',
                data: params
            }, callback);
        },
        processPaymentOnAlternatePAorPG: function processPaymentOnAlternatePAorPG(params, callback) {
            return api.post({
                url: BASE_URL + '/service_provider_tokens/token_transactional_data',
                data: params
            }, callback);
        }
    };
};