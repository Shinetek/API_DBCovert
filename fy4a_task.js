/**
 * Created by lenovo on 2017/5/9.
 * 三个仪器的任务详情
 * 1.任务统计
 * 2.任务列表
 * 3.任务详情
 */
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
            server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
            replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
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
            interval = interval + 1500;
            var timer = new Timer(interval);


            timeTwoFunc();
            //设置定时器
            timer.on('tick', function () {
                timeTwoFunc();
            });

            //开始 Timer
            timer.start();

            /**
             * 并行版本 仅仅对任务列表进行入库
             */
            function timeTwoFunc() {//同步进行所有函数
                get_TaskState(function () {
                    console.log(" 1   获取 任务详情 end");
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
                //循环计数
                require('./process/timerlog.js')("fy4a_taskstatus &fy4a_task_list");
            }

            //任务状态，add by lihy
            function get_TaskState(callback) {
                console.log("2.任务状态 获取开始 ");
                require('./process/taskstate.js')(callback);
            }

            //任务列表 giirs
            function Task_List_GIIRS(callback) {
                console.log("7   获取开始giirs 任务列表");
                require('./process/tasklist.js')('giirs', callback);
            }

            //任务列表 agri
            function Task_List_AGRI(callback) {
                console.log("7   获取开始agri 任务列表");
                require('./process/tasklist.js')('agri', callback);
            }

            //任务列表 lmi
            function Task_List_LMI(callback) {
                console.log("7   获取开始lmi 任务列表");
                require('./process/tasklist.js')('lmi', callback);
            }
        })();
    })();

})();