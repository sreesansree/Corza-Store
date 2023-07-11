'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _require = require('../utils/razorpay-utils'),
    normalizeBoolean = _require.normalizeBoolean;

module.exports = function (api) {

    var BASE_URL = "/accounts";

    return {
        requestProductConfiguration: function requestProductConfiguration(accountId, params, callback) {
            var tnc_accepted = params.tnc_accepted,
                rest = _objectWithoutProperties(params, ['tnc_accepted']);

            var data = Object.assign(_extends({ tnc_accepted: normalizeBoolean(tnc_accepted) }, rest));

            return api.post({
                version: 'v2',
                url: BASE_URL + '/' + accountId + '/products',
                data: data
            }, callback);
        },
        edit: function edit(accountId, productId, params, callback) {
            var tnc_accepted = params.tnc_accepted,
                rest = _objectWithoutProperties(params, ['tnc_accepted']);

            var data = Object.assign(_extends({ tnc_accepted: normalizeBoolean(tnc_accepted) }, rest));

            return api.patch({
                version: 'v2',
                url: BASE_URL + '/' + accountId + '/products/' + productId,
                data: data
            }, callback);
        },
        fetch: function fetch(accountId, productId, callback) {
            return api.get({
                version: 'v2',
                url: BASE_URL + '/' + accountId + '/products/' + productId
            }, callback);
        },
        fetchTnc: function fetchTnc(productName, callback) {
            return api.get({
                version: 'v2',
                url: '/products/' + productName + '/tnc'
            }, callback);
        }
    };
};