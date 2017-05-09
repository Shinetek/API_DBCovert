/**
 * Created by lenovo on 2017/4/26.
 */
(function () {

    'use strict';

    var faultlevelESchema = require("../module/fault_level_E_schame.js");

    var _ = require('lodash');
    var async = require("async");
    var restify = require("restify");
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
                //首先进行删除操作
                get_data: function (callback) {
                    /*    var m_FJSON = require("../demo/faultlevelE.json");
                     var jsonData = m_FJSON.result;
                     callback(null, jsonData);*/
                    console.log("2级 未处理 故障 状态 获取开始");
                    _getDataInfo(sysname, callback);
                },
                //删除后进行 添加操作
                del_data: ['get_data', function (results, callback) {
                    //async code to get some data
                   // console.log(results);
                    if (!_.isUndefined(results.get_data)) {
                        if (results.get_data.length > -1) {
                            _DeleteAllInfo(sysname, callback);
                        }
                        else {
                            callback("2级 未处理 故障 状态  返回结构异常", null);
                        }
                    }
                    else {
                        callback("2级 未处理 故障 状态  返回内容异常", null);
                    }
                }],
                save_data: ['get_data', 'del_data', function (results, callback) {
                    var m_jsonData = results.get_data;
                    // 遍历 调用 添加函数
                    console.log("2级 未处理 故障 状态 待插入数据：" + m_jsonData.length);
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
            var m_APIPath = "/RSMS/api/rest/mcs/faultlog/list/" + sysname + "?status=undeal&fault_level=E&start_index=1&end_index=100";
            console.log(basePath + m_APIPath);
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

        //2
        function _DeleteAllInfo(sysname, callback) {
            var conditions = {"sys": sysname};
            faultlevelESchema
                .remove(conditions, function (err) {
                    if (err) {
                        console.log("remove faultlevel E infos 失败");
                        callback(err, null);
                    } else {
                        console.log("remove faultlevel E infos 成功");
                        callback(null, null);
                    }
                });
        }

        //3
        function InsertDataSchema(sysname, DataInfo, callback) {
            DataInfo.sys = sysname;
            var schema = new faultlevelESchema();
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