/**
 * Created by lihy on 2017/4/26.
 */
(function () {
    'use strict';
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var taskNearSchema = new Schema({
        inst: {type: String},
        cur: {
            start_dt: {type: String},
            status: {type: String},
            task_name: {type: String}
        },
        next: {
            start_dt: {type: String},
            status: {type: String},
            task_name: {type: String}
        },
        previous: {
            start_dt: {type: String},
            status: {type: String},
            task_name: {type: String}
        }
    });
    taskNearSchema.methods.initData = function (body,inst) {
        var self = this;
        for(var prop in body){
            self[prop] = body[prop];
        }
        self.inst = inst;
    };
    module.exports = mongoose.model('tasknear', taskNearSchema);

})();