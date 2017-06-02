/**
 * Created by lenovo on 2017/5/24.
 * 遥测数据获取进程
 */
(function () {

    'use strict';

    var satelliteSchema = require("../module/satellite_schame.js");
    var satellitegroupSchema = require("../module/satellite_group_schame.js");
    var _ = require('lodash');
    var async = require("async");
    var restify = require("restify");
    var moment = require("moment");
    var m_config = require("../config.json");
    var basePath = m_config.APIURL;


    module.exports = function () {

        _getAPIJson();

        /**
         * 获取API json
         * @returns {{}}
         * @private
         */
        function _getAPIJson() {
            var m_DateStr = moment().utc().format("YYYYMMDD");

            async.auto({
                //首先进行数据获取操作
                get_data: function (callback) {
                    _getDataInfo(m_DateStr, callback);
                },
                //删除后进行 添加操作
                del_data: ['get_data', function (results, callback) {
                    if (!_.isUndefined(results.get_data)) {
                        if (results.get_data.length > 0) {
                            //删除
                            _DeleteAllInfo(callback);
                        }
                        else {
                            callback("遥测 状态数据获取 返回结构异常", null);
                        }
                    }
                    else {
                        callback("遥测 状态数据获取  返回内容异常", null);
                    }
                }],
                save_data: ['get_data', 'del_data', function (results, callback) {
                    var m_jsonData = results.get_data;
                    // 遍历 调用 添加函数
                    console.log("遥测 状态数据 待插入数据：" + m_jsonData.length);
                    async.each(m_jsonData, function (DataInfo, callback) {
                        InsertDataSchema(m_DateStr, DataInfo, callback);
                    }, function (err, result) {
                        console.log("遥测详情 插入完成 插值完成");
                        //
                        callback(err, result);
                    })
                }],
                del_data_group: ['get_data', 'del_data', 'save_data', function (results, callback) {
                    if (!_.isUndefined(results.get_data)) {
                        if (results.get_data.length > 0) {
                            //删除
                            _DeleteAllGroupInfo(callback);
                        }
                        else {
                            callback("遥测 状态数据获取 返回结构异常", null);
                        }
                    }
                    else {
                        callback("遥测 状态数据获取  返回内容异常", null);
                    }
                }],
                save_data_group: ['get_data', 'del_data', 'save_data', 'del_data_group', function (results, callback) {

                    var m_jsonData = results.get_data;
                    var m_LevelList = -[];
                    _.forEach(m_jsonData, function (value) {
                        // console.log(value.level);
                        m_LevelList.push(value.level);
                    });
                    m_LevelList = _.uniq(m_LevelList);
                    async.each(m_LevelList, function (DataInfo, callback) {
                        InsertGroupDataSchema(m_DateStr, DataInfo, callback);
                    }, function (err, result) {
                        console.log("遥测等级 插入完成 插值完成");
                        //
                        callback(err, result);
                    })
                }]

            }, function (err, results) {
                console.log('err = ', err);
                //  console.log('results = ', results);
            });

        }

        //1. 从API中 获取 json 数据
        function _getDataInfo(dateStr, callback) {
            var m_DateStr = dateStr;

            //RSMS/api/rest/mcs/capability/satellite?date=20170524
            var m_APIPath = "/RSMS/api/rest/mcs/capability/satellite?date=" + m_DateStr;
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
        function _DeleteAllInfo(callback) {
            var conditions = {};
            satelliteSchema
                .remove(conditions, function (err) {
                    if (err) {
                        console.log("remove 遥测数据  失败" + conditions.sys);
                        callback(err, null);
                    } else {
                        console.log("remove 遥测数据 成功" + conditions.sys);
                        callback(null, null);
                    }
                });
        }

        function _DeleteAllGroupInfo(callback) {
            var conditions = {};
            satellitegroupSchema
                .remove(conditions, function (err) {
                    if (err) {
                        console.log("remove 遥测数据分组  失败" + conditions.sys);
                        callback(err, null);
                    } else {
                        console.log("remove 遥测数据分组 成功" + conditions.sys);
                        callback(null, null);
                    }
                });
        }

        //3
        function InsertDataSchema(datestr, DataInfo, callback) {
            var m_DateStr = moment().utc().format("YYYYMMDD");
            var m_TimeStr = moment().utc().format("hhmmss");
            DataInfo.up_date = m_DateStr + m_TimeStr;
            DataInfo.url_date = datestr;
            DataInfo.selected = false;
            DataInfo.ycname = _.trim(DataInfo.ycname.toString());
            DataInfo.ycname_En = get_ycname_En(DataInfo.ycname);
            var schema = new satelliteSchema();
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


        function InsertGroupDataSchema(datestr, DataInfo, callback) {
            var schema = new satellitegroupSchema();
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

        //
        function get_ycname_En(ycname) {
            //   console.log(ycname);

            //根据当前遥测名称获取 英文名称
            if (ycname) {
                if (m_NameConvert[ycname]) {
                    return m_NameConvert[ycname];
                }
            }
            return "";

        }

        var m_NameConvert = m_config.ycname_Convert;
        /*  {
         "遥控帧计数": ""
         }*/
    }

})
();