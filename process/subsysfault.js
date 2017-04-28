/**
 * Created by lihy on 2017/4/26.
 */

(function () {
    'use strict';

    var restify = require('restify');
    var sd = require('silly-datetime');
    var time = sd.format(new Date(),'YYYYMMDD');
    var subSysFaultSchema = require('../module/subsysfault-schema.js');
   // var testJson = require('../test/tsconfig.json');
    var m_config = require("../config.json");
    var basePath = m_config.APIURL;
    var client = restify.createJsonClient({
        url:basePath,
        version:'0.0.1'
    });
    function _deleteAllInfo(callback) {
        var conditions = {};
        subSysFaultSchema
            .remove(conditions, function (err) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, null);
                }
            });
    };
    module.exports = function (callback) {
        _deleteAllInfo(callback);
         client.get("/_ds/mcs/faultlog/stat?date="+ time,function (err,req,res,obj) {
            var schema = new subSysFaultSchema();
            //console.log(obj);
            schema.initData(obj.result);
            schema.save(function (err) {
                if(err){
                    callback(err,null);
                    console.log("save error.");
                }
                else{
                    console.log("subsysfault save ok.");
                    callback(null,null);
                }
            })
         })
    }
})();
