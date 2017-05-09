/**
 * Created by lenovo on 2017/4/26.
 */

require('../process/faultlevelF.js')(function (err, data) {
    if (err) {
        console.log("ERR!");
        console.log(err);
        return;
    }
    console.log(data);
});
