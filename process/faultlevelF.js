/**
 * Created by lenovo on 2017/4/26.
 */
(function () {

    'use strict';

    var faultlevelFSchema = require("../module/fault_level_F_schame.js");

    var _ = require('lodash');
    var async = require("async");
    var restify = require("restify");
    var m_config = require("../config.json");
    var basePath = m_config.APIURL;

    module.exports = function (callback) {




        //添加
        _getAPIJson(callback);

        /**
         * 获取API json
         * @returns {{}}
         * @private
         */
        function _getAPIJson(callback) {


            async.auto({
                //首先进行删除操作
                get_data: function (callback) {
                    var m_FJSON = require("../demo/faultlevelF.json");
                    var jsonData = m_FJSON.result;
                    _getDataInfo(callback);
                    //callback(null, jsonData);
                },
                //删除后进行 添加操作
                del_data: ['get_data', function (results, callback) {
                    //async code to get some data
                    _DeleteAllInfo(callback);
                }],
                save_data: ['get_data', 'del_data', function (results, callback) {
                    var m_jsonData = results.get_data;
                    // 遍历 调用 添加函数
                    async.each(m_jsonData, function (DataInfo, callback) {
                        InsertDataSchema(DataInfo, callback);
                    }, function (err, result) {
                        console.log("所有插值完成");
                        callback(err, result);
                    })
                }]
            }, function (err, results) {
                console.log('err = ', err);
                callback(null, null);
                //  console.log('results = ', results);
            });

        }

        //1. 从API中 获取 json 数据
        function _getDataInfo(callback) {
            var m_APIPath = "/_ds/mcs/faultlog/list/dts?status=undeal&fault_level=F&start_index=1&end_index=100";
            console.log(m_APIPath);
            var client = restify.createJsonClient({
                url: basePath,
                version: '*'
            });
            //todo 修改修改对RL
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

        //2. 删除所有 信息
        function _DeleteAllInfo(callback) {
            var conditions = {};
            faultlevelFSchema
                .remove(conditions, function (err) {
                    if (err) {
                        console.log("remove faultlevelfinfos 失败");
                        callback(err, null);
                    } else {
                        console.log("remove faultlevelfinfo 成功");
                        callback(null, null);
                    }
                });
        }


        //3. 逐行 插入数据
        function InsertDataSchema(DataInfo, callback) {
            console.log(DataInfo);
            var schema = new faultlevelFSchema();
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