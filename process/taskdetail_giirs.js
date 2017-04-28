/**
 * Created by lenovo on 2017/4/26.
 *
 * 任务 详情获取部分
 * 1.获取当前任务列表
 */
(function () {

    'use strict';

    var TaskDetailSchema = require("../module/task_detail_schame.js");

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
                //使用　api 获取 当前任务列表状态
                get_tasklist: function (callback) {
                    _getTaskList(callback);
                },
                get_listDetail: ['get_tasklist', function (results, callback) {
                    // 判断上次 task list 获取的 结果不为空
                    if (results.get_tasklist.length > 0) {
                        var m_TaskListJson = results.get_tasklist;
                        async.map(m_TaskListJson, function (DataInfo, callback) {
                            //通过URL获取 TASK  详情
                            _getTaskDetailInfo(DataInfo, callback);
                        }, function (err, result) {
                            console.log("所有的 task detail 详情数据 获取完成");
                            callback(err, result);
                        });
                    }
                    else {
                        callback("err", null);
                    }
                }],
                //获取全部task的任务信息后 才进行删除 删除后进行
                del_data: ['get_listDetail', function (results, callback) {
                    if (!_.isUndefined(results.get_listDetail)) {
                        if (results.get_listDetail.length > -1) {
                            _DeleteAllInfo(callback);
                        }
                        else {
                            callback("err", null);
                        }
                    }
                    else {
                        callback("err", null);
                    }
                }],
                //删除完成后 进行保存
                save_data: ['get_listDetail', 'del_data', function (results, callback) {

                    var m_jsonData = results.get_listDetail;
                    console.log("需要插入的taskdetail 总数：" + m_jsonData.length);
                    // 遍历 调用 添加函数
                    async.each(m_jsonData, function (DataInfo, callback) {
                        InsertDataSchema(DataInfo, callback);
                    }, function (err, result) {
                        console.log("taskdetail 数据库插入完成");
                        callback(err, result);
                    })
                }]
            }, function (err, results) {
                if (err) {
                    console.log('err = ', err);
                }
                callback(err, results);

            });
        }

        //1. 通过url 获取  task 的 列表 供详情获取使用 json info
        function _getTaskList(callback) {


            //获取当前的年月日时间
            var m_DateStr = moment().utc().format("YYYYMMDD");
            var m_TimeStr = moment().utc().format("hhmmss");
            //获取基于当前年月日时间的URL
            var m_APIPath = "/_ds/mcs/task/list/giirs?date=" + m_DateStr + "&time=" + m_TimeStr;
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


        //2. 通过URL 获取 每一个 task  的详细情况

        function _getTaskDetailInfo(taskinfo, callback) {
            //获取每一个Task的 ID
            var m_TaskID = taskinfo.task_id;
            var m_DateStr = moment().utc().format("YYYYMMDD");
            var m_APIPath = "/_ds/mcs/task/detail/giirs?task_id=" + m_TaskID + "&date=" + m_DateStr;
            var client = restify.createJsonClient({
                url: basePath,
                version: '*'
            });
            //todo 修改修改对RL
            client.get(m_APIPath,
                function (err, req, res, obj) {                    //assert.ifError(err);
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        var m_json = obj.result;
                        m_json.task_id = m_TaskID;
                        callback(null, m_json);
                    }
                });
        }


        //3. 删除详情列表中的所有信息
        function _DeleteAllInfo(callback) {

            var conditions = {};
            TaskDetailSchema
                .remove(conditions, function (err) {
                    if (err) {
                        console.log("删除 TaskDetailinfo 表单 原有内容 失败");
                        callback(err, null);
                    } else {
                        console.log("删除 TaskDetailinfo 表单 原有内容 成功");
                        callback(null, null);
                    }
                });
        }


        //4. 插入详情列表中的 每一条信息
        function InsertDataSchema(DataInfo, callback) {
            //console.log(DataInfo);
            var schema = new TaskDetailSchema();
            schema.initData(DataInfo);

            schema.save(function (err) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                }
                else {
                    //  console.log(schema);
                    callback(null, null);
                }
            });
        }
    }

})
();