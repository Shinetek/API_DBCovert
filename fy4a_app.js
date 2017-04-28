/**
 * Created by liuyp on 2017/04/26
 */

/// <reference path="./../typings/index.d.ts" />

(function () {

    'use strict';

    //加载配置
    var Config = require("./config.json");


    //mongoose 配置
    const MONGOOSE_URI = process.env.MONGOOSE_URI || Config.MongodbUrl;

    //加载的各个部件
    var morgan = require('morgan');
    var mongoose = require('mongoose');
    var path = require('path');
    var log4js = require('log4js');
    var async = require("async");


    var mongoose_connect = false;


    (function () {

        var opt_Mongoose = {
            server: {
                auto_reconnect: true,
                poolSize: 8000
            }
        };

        mongoose.connect(MONGOOSE_URI, opt_Mongoose);

        mongoose.connection.on('error', function (err) {
            /*  logger.error('Mongoose connection error: %s', err.stack);*/
            mongoose_connect = false;
            throw err;
        });

        mongoose.connection.on('open', function () {
            // logger.info('Mongoose connected to the Mongo');
            mongoose_connect = true;
        });

        mongoose.Promise = global.Promise;

        //定时运行部分
        (function () {
            // logger.info('开始循环!');
            console.log(new Date() + "开始循环检索！");

            var Config = require("./config.json");
            var interval = (Config.TimetableInterval) ? Config.TimetableInterval : 900000;
            var Timer = require('./lib/timer.js').Timer;
            var timer = new Timer(interval);

            //初始化立刻运行一次
            // Task_List_LMI(function (callback) {
            //     console.log("lmi test");
            // })
             //timeTwoFunc();
            //设置定时器
            timer.on('tick', function () {
                timeTwoFunc();
            });

            //开始 Timer
            timer.start();

            /**
             * 每一次 timer 运行的时候 执行的函数   todo 并行测试
             */
            function timerOnceFunc() {//同步进行所有函数


                async.parallel([
                        function (callback4) {
                            get_Fault_level_F(callback4);
                        },
                        function (callback5) {
                            Fault_level_E(callback5);
                        },
                        function (callback6) {
                            Task_List_GIIRS(callback6);
                        },
                        function (callback7) {
                            Task_Detail(callback7);
                        },
                        function (callback8) {
                            Task_List_AGRI(callback8);
                        },
                        function (callback9) {
                            Task_List_LMI(callback9);
                        }
                    ],
                    function (err, results) {
                        console.log("all end!");

                        // the results array will equal ['one','two'] even though
                        // the second function had a shorter timeout.
                    });
                //同步进行所有函数
                async.parallel([
                        function (callback1) {
                            get_SubSysFault(callback1);
                            // get_TaskState(callback1);
                            //get_TaskNearState(callback1);
                            //get_SubDasStateState(callback1);
                            // get_Fault_level_F(callback1);
                        }],
// optional callback
                    function (err, results) {
                        console.log("all end!");

                        // the results array will equal ['one','two'] even though
                        // the second function had a shorter timeout.
                    });

            }

            /**
             * 行版本
             */
            function timeTwoFunc() {//同步进行所有函数

                get_SubSysFault(function () {
                    console.log("1  get_SubSysFault end");
                });
                get_TaskState(function () {
                    console.log("2 get_TaskState end");
                });
                get_TaskNearState_AGRI(function () {
                    console.log("3 get_TaskNearState_AGRI end");
                });

                get_TaskNearState_GIIRS(function () {
                    console.log("3 get_TaskNearState_GIIRS end");
                });

                get_TaskNearState_LMI(function () {
                    console.log("3 get_TaskNearState_LMI end");
                });
                get_SubDasStateState(function () {
                    console.log("4 get_SubDasStateState end");
                });
                get_Fault_level_F(function () {
                    console.log("5 get_Fault_level_F end");
                });
                Fault_level_E(function () {
                    console.log(" 6 Fault_level_E end");
                });
                Task_List_GIIRS(function () {
                    console.log(" 7 Task_List_GIIRS end");
                });
                Task_List_AGRI(function () {
                    console.log(" 7 Task_List_AGRI end");
                });
                Task_List_LMI(function () {
                    console.log(" 7 Task_List_LMI end");
                });
                Task_Detail_GIIRS(function () {
                    console.log(" 8 Task_Detail_GIIRS end");
                });

                Task_Detail_AGRI(function () {
                    console.log(" 8 Task_Detail_AGRI end");
                });

                Task_Detail_LMI(function () {
                    console.log(" 8 Task_Detail_LMI end");
                });

                //循环计数
                require('./process/timerlog.js')();
            }

            //分系统的故障状态，add by lihy
            function get_SubSysFault(callback) {
                console.log("1.分系统的故障状态 获取开始 ");
                require('./process/subsysfault.js')(callback);
            }

            //任务状态，add by lihy
            function get_TaskState(callback) {
                console.log("2.任务状态 获取开始 ");
                require('./process/taskstate.js')(callback);
            }

            //任务当前、上一个、下一个状态，add by lihy
            function get_TaskNearState_AGRI(callback) {
                console.log("3.任务AGRI当前 上一个 下一个状态 获取开始 ");
                require('./process/tasknear_agri.js')(callback);
            }

            //任务当前、上一个、下一个状态，add by lihy
            function get_TaskNearState_GIIRS(callback) {
                console.log("3.任务GIIRS 上一个 下一个状态 获取开始 ");
                require('./process/tasknear_giirs.js')(callback);
            }

            //任务当前、上一个、下一个状态，add by lihy
            function get_TaskNearState_LMI(callback) {
                console.log("3.任务LMI 上一个 下一个状态 获取开始 ");
                require('./process/tasknear_lmi.js')(callback);
            }

            //分系统的设备状态，add by lihy
            function get_SubDasStateState(callback) {
                console.log("4.分系统的设备状态  获取开始 ");
                require('./process/subdasstate.js')(callback);
            }


            //1级故障
            function get_Fault_level_F(callback) {
                console.log("5   获取开始 ");
                require('./process/faultlevelF.js')(callback);
            }

            //2级故障
            function Fault_level_E(callback) {
                console.log("6   获取开始 ");
                require('./process/faultlevelE.js')(callback);
            }

            //任务列表 giirs
            function Task_List_GIIRS(callback) {
                console.log("7   获取开始giirs ");
                require('./process/tasklist_giirs.js')(callback);
            }

            //任务列表 agri
            function Task_List_AGRI(callback) {
                console.log("7   获取开始agri ");
                require('./process/tasklist_agri.js')(callback);
            }

            //任务列表 lmi
            function Task_List_LMI(callback) {
                console.log("7   获取开始lmi ");
                require('./process/tasklist_lmi.js')(callback);
            }


            //任务详情
            function Task_Detail_GIIRS(callback) {
                console.log("8  Task_Detail_GIIRS 获取开始 ");
                require('./process/taskdetail_giirs.js');
            }

            //任务详情
            function Task_Detail_AGRI(callback) {
                console.log("8  Task_Detail_AGRI 获取开始 ");
                require('./process/taskdetail_agri.js')(callback);
            }

            //任务详情
            function Task_Detail_LMI(callback) {
                console.log("8  Task_Detail_LMI 获取开始 ");
                require('./process/taskdetail_lmi.js')(callback);
            }
        })();
    })();

})();