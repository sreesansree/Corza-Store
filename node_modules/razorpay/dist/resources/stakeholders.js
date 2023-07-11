'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _require = require('../utils/razorpay-utils'),
    normalizeNotes = _require.normalizeNotes,
    normalizeBoolean = _require.normalizeBoolean;

module.exports = function (api) {

    var BASE_URL = "/accounts";

    return {
        create: function create(accountId, params, callback) {
            var relationship = params.relationship,
                notes = params.notes,
                rest = _objectWithoutProperties(params, ['relationship', 'notes']);

            if (params.hasOwnProperty('relationship')) {
                if (params.relationship.hasOwnProperty('executive')) {
                    relationship.executive = normalizeBoolean(params.relationship.executive);
                }

                if (params.relationship.hasOwnProperty('director')) {
                    relationship.director = normalizeBoolean(params.relationship.director);
                }
            }

            var data = Object.assign({ relationship: relationship }, normalizeNotes(notes), rest);

            return api.post({
                version: 'v2',
                url: BASE_URL + '/' + accountId + '/stakeholders',
                data: data
            }, callback);
        },
        edit: function edit(accountId, stakeholderId, params, callback) {
            var notes = params.notes,
                relationship = params.relationship,
                rest = _objectWithoutProperties(params, ['notes', 'relationship']);

            if (params.hasOwnProperty('relationship')) {
                if (params.relationship.hasOwnProperty('executive')) {
                    relationship.executive = normalizeBoolean(params.relationship.executive);
                }

                if (params.relationship.hasOwnProperty('director')) {
                    relationship.director = normalizeBoolean(params.relationship.director);
                }
            }

            var data = Object.assign({ relationship: relationship }, normalizeNotes(notes), rest);

            return api.patch({
                version: 'v2',
                url: BASE_URL + '/' + accountId + '/stakeholders/' + stakeholderId,
                data: data
            }, callback);
        },
        fetch: function fetch(accountId, stakeholderId, callback) {
            return api.get({
                version: 'v2',
                url: BASE_URL + '/' + accountId + '/stakeholders/' + stakeholderId
            }, callback);
        },
        all: function all(accountId, callback) {
            return api.get({
                version: 'v2',
                url: BASE_URL + '/' + accountId + '/stakeholders'
            }, callback);
        },
        uploadStakeholderDoc: function uploadStakeholderDoc(accountId, stakeholderId, params, callback) {
            return api.post({
                version: 'v2',
                url: BASE_URL + '/' + accountId + '/stakeholders/' + stakeholderId + '/documents',
                formData: params
            }, callback);
        },
        fetchStakeholderDoc: function fetchStakeholderDoc(accountId, stakeholderId, callback) {
            return api.get({
                version: 'v2',
                url: BASE_URL + '/' + accountId + '/stakeholders/' + stakeholderId + '/documents'
            }, callback);
        }
    };
};