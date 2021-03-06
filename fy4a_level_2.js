/**
 * Created by liuyp on 2017/5/5.
 * 分系统的 数据获取 DTS 错误部分
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
    var async = require("async");


    var mongoose_connect = false;


    (function () {

        var opt_Mongoose = {
            server: {
                auto_reconnect: true,
                poolSize: 2000
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
            interval = interval + 200000;
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
            function timeTwoFunc() {//同步进行所有函数

                get_Fault_level_F();
                //循环计数
                require('./process/timerlog.js')("fy4a_level_2");
            }

            //2级故障
            function get_Fault_level_F() {
                console.log("5 CNS 二级异常  获取开始 ");
                //1
                require('./process/faultlevelE.js')("cns");
                //2
                require('./process/faultlevelE.js')("cvs");
                //3
                require('./process/faultlevelE.js')("dss");
                //4
                require('./process/faultlevelE.js')("dts");
               //5
                require('./process/faultlevelE.js')("mcs");
                //6
                require('./process/faultlevelE.js')("mrs");
                //7
                require('./process/faultlevelE.js')("nrs");
                //8
                require('./process/faultlevelE.js')("pgs");
                //9
                require('./process/faultlevelE.js')("sws");
             

            }


        })();
    })();

})();