(function () {

    'use strict';
    const HTTP_PORT = 5001;
    var restify = require('restify');
    (function () {
        var server = restify.createServer({
            name: ' URL-API'
        });

        server.use(restify.queryParser());
        server.use(restify.bodyParser({
            requestBodyOnGet: true
        }));
        server.use(restify.CORS());

        server.get({
            path: '/getweather/:city',
            version: '0.0.1'
        }, _geturl);

        server.listen(HTTP_PORT, function () {
            console.log('%s listening at %s ', server.name, server.url);
        });

        function _geturl(req, res, next) {
            //   console.log(req.url);
            var m_CallbackName = req.url.split("?")[1];
            var m_URL = req.body;
            var m_city = req.params.city;
            console.log(m_city);
            if (!m_URL) {
                m_URL = 'http://www.sojson.com/open/api/weather/json.shtml?city=' + m_city;
            }
            m_URL = encodeURI(m_URL);
            console.log(m_URL);
            var client = restify.createJsonClient({
                url: m_URL,
                version: '*'
            });
            client.get('',
                function (err, req, res1, obj) {
                    if (err) {
                        console.log(err);
                        res.end("URL不符合规范");
                        next();
                    }
                    else {
                        res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
                        var data = obj;
                        data = JSON.stringify(data);
                        //假设我们定义的回调函数名为test
                        var callback = m_CallbackName + '(' + data + ');';
                        res.end(callback);
                        next();
                    }
                });
        }
    })();
})();


