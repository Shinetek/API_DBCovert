/**
 * Created by liuyp on 2017/4/26.
 * 每一次入库记录
 */
(function () {

    'use strict';

    var TimerLogSchema = require("../module/timerlog_schame.js");

    var _ = require('lodash');
    var restify = require("restify");
    var moment = require("moment");

    module.exports = function (sys) {
        InsertDataSchema();
        function InsertDataSchema() {
            var DataInfo = {};
            DataInfo.converttime = moment().utc().format();
            DataInfo.sys = sys;
            var schema = new TimerLogSchema();
            schema.initData(DataInfo);
            schema.save(function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                }
            });
        }
    }

})
();