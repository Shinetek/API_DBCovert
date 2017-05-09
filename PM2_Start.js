/**
 * Created by liuyp on 2017/5/5.
 *
 *
 * pm2 自动自动启动程序
 *
 * */
var pm2 = require('pm2');
var pm2_conf = require("pm2_DBConvert.json");
pm2.connect(function (err) {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    pm2.start(pm2_conf, function (err, apps) {
        pm2.disconnect();   // Disconnects from PM2
        if (err) throw err
    });
});



