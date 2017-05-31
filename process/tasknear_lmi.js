/**
 * Created by lihy on 2017/4/26.
 */
(function () {
    'use strict';

    var restify = require('restify');

    var moment = require("moment");
    var taskNearSchema = require('../module/tasknear-schema.js');

    var m_config = require("../config.json");

    var basePath = m_config.APIURL;

    var client = restify.createJsonClient({
        url: basePath,
        version: '0.0.1'
    });

    /**
     * 删除当前状态
     * @param callback
     * @private
     */
    function _deleteAllInfo(callback) {
        var conditions = {
            inst: 'lmi'
        };
        taskNearSchema
            .remove(conditions, function (err) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, null);
                }
            });
    }

    module.exports = function (callback) {
        _deleteAllInfo(callback);
        var month = moment().utc().format("YYYYMMDD");
        var hour = moment().utc().format("hhmmss");
        client.get("/RSMS/api/rest/mcs/task/near/lmi?date=" + month + "&time=" + hour, function (err, req, res, obj) {
            //
            var schema = new taskNearSchema();
            schema.initData(obj.result, 'lmi');
            schema.save(function (err) {
                if (err) {
                    callback(err, null);
                    console.log("save error.");
                }
                else {
                    console.log("tasknear lmi save ok.");
                    callback(null, null);
                }
            })
        })
    }
})();