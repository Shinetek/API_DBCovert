/**
 * Created by lenovo on 2017/5/11.
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
            interval = interval + 90908;
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
             * 并行版本
             */
            function timeTwoFunc() {

                //同步进行所有函数

                //liuyp 20170814 DTS MRS 性能指标 1min 一个

                require('./process/capability.js')("dts");
                require('./process/capability.js')("mrs");


                //循环计数
                require('./process/timerlog.js')("fy4a_capability");
            }


        })();
    })();

})();