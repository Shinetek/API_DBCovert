/**
 * Created by lenovo on 2017/5/11.
 */
'use strict';
var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.01953125, 0.009765625, 0.0048828125, 0.00244140625, 0.001220703125, 0.0006103515625];
console.log("经纬度范围：360 180");
//遍历求块数
for (var i = 0; i < resolutions.length; i++) {
    //256 * resolutions[i] 计算的为当前图层 每一个256的小块 实际显示的经纬度
    var y0 = 360 / (256 * resolutions[i]);
    var x0 = 180 / (256 * resolutions[i]);
    console.log(i + "层块数(y:x)：" + y0 + ":" + x0);
}


