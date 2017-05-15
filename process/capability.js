/**
 * Created by lenovo on 2017/5/11.
 * 性能指标入库程序
 */

(function () {

    'use strict';

    var CapabilitySchema = require("../module/capability_schame.js");

    var _ = require('lodash');
    var async = require("async");
    var restify = require("restify");
    var moment = require("moment");
    var m_config = require("../config.json");
    var basePath = m_config.APIURL;


    module.exports = function (sysname) {

        _getAPIJson(sysname);

        /**
         * 获取API json
         * @returns {{}}
         * @private
         */
        function _getAPIJson(sysname) {
            async.auto({
                //首先进行数据获取操作
                get_data: function (callback) {
                    _getDataInfo(sysname, callback);
                },
                //删除后进行 添加操作
                del_data: ['get_data', function (results, callback) {
                    if (!_.isUndefined(results.get_data)) {
                        if (results.get_data.length > 0) {
                            //删除
                            _DeleteAllInfo(sysname, callback);
                        }
                        else {
                            callback("capa 状态数据获取 返回结构异常", null);
                        }
                    }
                    else {
                        callback(" capa 状态数据获取  返回内容异常", null);
                    }
                }],
                save_data: ['get_data', 'del_data', function (results, callback) {
                    var m_jsonData = results.get_data;
                    // 遍历 调用 添加函数
                    console.log("capa 状态数据 待插入数据：" + m_jsonData.length);
                    async.each(m_jsonData, function (DataInfo, callback) {
                        InsertDataSchema(sysname, DataInfo, callback);
                    }, function (err, result) {
                        console.log("所有插值完成");
                        callback(err, result);
                    })
                }]
            }, function (err, results) {
                console.log('err = ', err);
                //  console.log('results = ', results);
            });

        }

        //1. 从API中 获取 json 数据
        function _getDataInfo(sysname, callback) {

            var m_DateStr = moment().utc().format("YYYYMMDD");
            var m_TimeStr = moment().utc().format("hhmmss");
            var m_APIPath = "/RSMS/api/rest/mcs/capability/" + sysname + "?date=" + m_DateStr + "&time=" + m_TimeStr;
            console.log(moment().utc());
            console.log(basePath + m_APIPath);

            var client = restify.createJsonClient({
                url: basePath,
                version: '*'
            });
            client.get(m_APIPath,
                function (err, req, res, obj) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        //返回 task list
                        callback(null, obj.result);
                    }
                });
        }

        //2
        function _DeleteAllInfo(sysname, callback) {
            var conditions = {"sys": sysname};
            CapabilitySchema
                .remove(conditions, function (err) {
                    if (err) {
                        console.log("remove capa  失败" + conditions.sys);
                        callback(err, null);
                    } else {
                        console.log("remove capa 成功" + conditions.sys);
                        callback(null, null);
                    }
                });
        }

        //3
        function InsertDataSchema(sysname, DataInfo, callback) {
            var m_DateStr = moment().utc().format("YYYYMMDD");
            var m_TimeStr = moment().utc().format("hhmmss");
            DataInfo.sys = sysname;
            DataInfo.datastr = m_DateStr + " " + m_TimeStr;
            var schema = new CapabilitySchema();
            schema.initData(DataInfo);
            schema.save(function (err) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                }
                else {
                    callback(null, null);
                }
            });
        }


    }

})
();