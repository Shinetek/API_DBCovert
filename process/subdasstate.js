/**
 * Created by lihy on 2017/4/26.
 */
(function () {
    'use strict';

    var restify = require('restify');
    var async = require('async');
    var sd = require('silly-datetime');
    var date = new Date();
    var month = sd.format(date, 'YYYYMMDD');
    var hour = sd.format(date, 'HHmmss');
    var subDasStateSchema = require('../module/subdasstate-schema.js');
    //var testJson = require('../test/subdas.json');
    var m_config = require("../config.json");
    var basePath = m_config.APIURL;
    var client = restify.createJsonClient({
        url: basePath,
        version: '0.0.1'
    });

    function _deleteAllInfo(callback) {
        var conditions = {};
        subDasStateSchema
            .remove(conditions, function (err) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, null);
                }
            });
    };
    module.exports = function (callback) {
        _deleteAllInfo(callback);
        client.get("/_ds/mcs/resource/dts_station?date=" + month + "&time=" + hour, function (err, req, res, obj) {
            async.each(obj.result, function (data, callback) {
                var schema = new subDasStateSchema();
                schema.initData(data);
                schema.save(function (err) {
                    if (err) {
                        callback(err, null);
                        console.log("save error.");
                    }
                })
            });
            console.log("subDasStateState save ok.");
            callback(null, null);
        });
    }
})();