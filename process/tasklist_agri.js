/**
 * Created by lenovo on 2017/4/26.
 */
/**
 * Created by lenovo on 2017/4/26.
 */
(function () {

    'use strict';

    var TaskSchema = require("../module/task_schame.js");

    var _ = require('lodash');
    var async = require("async");
    var restify = require("restify");
    var moment = require("moment");
    var m_config = require("../config.json");
    var basePath = m_config.APIURL;

    module.exports = function (callback) {
        refresh(callback);

        function refresh(callback) {

            async.auto({
                //首先进行删除操作
                get_data: function (callback) {
                    /*var m_FJSON = require("../demo/tasklist.json");
                     var jsonData = m_FJSON.result;
                     callback(null, jsonData);
                     */
                    _getAPIInfo(callback)
                },
                //删除后进行 添加操作
                del_data: ['get_data', function (results, callback) {
                    //async code to get some data
                    if (results.get_data.length > 0) {
                        _DeleteAllInfo(callback);
                    }
                    else {
                        callback("err", null);
                    }
                }],
                save_data: ['get_data', 'del_data', function (results, callback) {
                    var m_jsonData = results.get_data;
                    // 遍历 调用 添加函数
                    async.each(m_jsonData, function (DataInfo, callback) {
                        InsertDataSchema(DataInfo, callback);
                    }, function (err, result) {
                        console.log("task list 所有数据入库完成");
                        callback(err, result);
                    })
                }]
            }, function (err, results) {
                console.log('err = ', err);
                callback(err, results);

            });
        }

        //通过url 获取 json info
        function _getAPIInfo(callback) {


            //获取当前的年月日时间
            var m_DateStr = moment().utc().format("YYYYMMDD");
            var m_TimeStr = moment().utc().format("hhmmss");
            //获取基于当前年月日时间的URL
            var m_APIPath = "/_ds/mcs/task/list/agri?date=" + m_DateStr + "&time=" + m_TimeStr;
            var client = restify.createJsonClient({
                url: basePath,
                version: '*'
            });
            //
            client.get(m_APIPath,
                function (err, req, res, obj) {
                    //assert.ifError(err);
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        //返回 task list
                        callback(null, obj.result);
                    }
                });
        }

        function _DeleteAllInfo(callback) {
            var conditions = {
                inst: "agri"
            };
            TaskSchema
                .remove(conditions, function (err) {
                    if (err) {
                        console.log("remove TaskSchema agri 失败");
                        callback(err, null);
                    } else {
                        console.log("remove TaskSchema agri成功");
                        callback(null, null);
                    }
                });
        }

        function InsertDataSchema(DataInfo, callback) {
                     var schema = new TaskSchema();
            schema.initData(DataInfo, "agri");
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