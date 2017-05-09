/**
 * Created by lihy on 2017/4/26.
 */
(function () {
    'use strict';

    var restify = require('restify');
    var sd = require('silly-datetime');
    var date = new Date();
    var month = sd.format(date,'YYYYMMDD');
    var hour = sd.format(date,'HHmmss');
    var taskNearSchema = require('../module/tasknear-schema.js');

    var m_config = require("../config.json");

    var basePath = m_config.APIURL;

    var client = restify.createJsonClient({
        url:basePath,
        version:'0.0.1'
    });
    function _deleteAllInfo(callback) {
        var conditions = {
            inst:'lmi'
        };
        taskNearSchema
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
         client.get("/RSMS/api/rest/mcs/task/near/lmi?date="+ month + "&time=" + hour,function (err,req,res,obj) {
             //
             var schema = new taskNearSchema();
             schema.initData(obj.result,'lmi');
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