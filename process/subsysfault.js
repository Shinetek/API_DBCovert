/**
 * Created by lihy on 2017/4/26.
 */

(function () {
    'use strict';

    var restify = require('restify');


    var moment = require("moment");
    var subSysFaultSchema = require('../module/subsysfault-schema.js');

    var m_config = require("../config.json");
    var basePath = m_config.APIURL;


    //删除当前所有信息 删除后调用添加
    function _deleteAllInfo(callback, result, time) {
        var conditions = {};
        subSysFaultSchema
            .remove(conditions, function (err) {
                if (err) {
                    callback(err, null);
                } else {

                    _SaveAllInfo(result, time);
                    callback(null, null);
                }
            });
    }

    /**
     * 删除后调用的添加函数
     * @param result
     * @private
     */
    function _SaveAllInfo(result, time) {
        var schema = new subSysFaultSchema();
        result.savetime = moment().utc().format("YYYYMMDD") + " " + moment().utc().format("hhmmss");
        result.urltime = time;
        //初始化
        schema.initData(result);
        //保存
        schema.save(function (err) {
            if (err) {
                console.log("subsysfault save error.");
            }
            else {
                console.log("subsysfault save ok.");
            }
        })
    }

    //对外接口函数
    module.exports = function (callback) {
        //var time = sd.format(new Date(), 'YYYYMMDD');
        //修改为使用UTC时间
        var time = moment().utc().format("YYYYMMDD");

        //建立获取json 的 client
        var client = restify.createJsonClient({
            url: basePath,
            version: '0.0.1'
        });
        client.get("/RSMS/api/rest/mcs/faultlog/stat?date=" + time, function (err, req, res, obj) {
            if (obj.result != null) {
                _deleteAllInfo(callback, obj.result, time);
            }
        })
    }
})();
