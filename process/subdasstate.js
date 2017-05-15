/**
 * Created by lihy on 2017/4/26.
 */
(function () {
    'use strict';

    var restify = require('restify');
    var async = require('async');

    var moment = require("moment");
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

        var month = moment().utc().format("YYYYMMDD");
        var hour = moment().utc().format("hhmmss");

        client.get("/RSMS/api/rest/mcs/resource/dts_station?date=" + month + "&time=" + hour, function (err, req, res, obj) {
            async.each(obj.result, function (data, callback) {
                var schema = new subDasStateSchema();
                //加入时间串 对时间进行修改
                data.urldate = month + "_" + hour;
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