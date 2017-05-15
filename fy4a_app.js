/**
 * Created by liuyp on 2017/04/26
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

            //初始化立刻运行一次
            timeTwoFunc();
            //设置定时器
            timer.on('tick', function () {
                timeTwoFunc();
            });

            //开始 Timer
            timer.start();

            /**
             * 并行版本
             */
            function timeTwoFunc() {//同步进行所有函数

                //
                get_SubSysFault(function () {
                    console.log("1  get_SubSysFault end");
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

                //循环计数
                require('./process/timerlog.js')("fy4a_app");
            }

            //分系统的故障状态，add by lihy
            function get_SubSysFault(callback) {
                console.log("1.分系统的故障状态 获取开始 ");
                require('./process/subsysfault.js')(callback);
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








        })();
    })();

})();