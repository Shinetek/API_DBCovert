/**
 * Created by lenovo on 2017/4/27.
 */
/**
 * Created by liuyp on 2017/4/26.
 *  1级故障
 *
 */
(function () {

    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var _ = require('lodash');

    var TimerLogSchema = new Schema({
        converttime: {type: String}
    });

    TimerLogSchema.methods.initData = function (body) {
        var self = this;
        for (var prop in body) {
            self[prop] = body[prop];
        }
    };

    TimerLogSchema.methods.reportVerify = function (body) {
        return reportVerify(body);
    };

    module.exports = mongoose.model('TimerLog', TimerLogSchema);

    //是否存在各个必须字段 update使用
    function reportVerify(body) {
        if (_.isNull(body) || _.isUndefined(body)) {
            return false;
        }
        if (_.isUndefined(body.converttime)) {
            console.log("必须值为空！");
            return true;
        } else {
            return true;
        }

    }
})();