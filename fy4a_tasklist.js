/**
 * Created by lenovo on 2017/5/9.
 * 三个仪器的任务详情
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
                require('./process/timerlog.js')();
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
        })();
    })();

})();