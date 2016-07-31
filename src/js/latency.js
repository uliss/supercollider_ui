var api = require('./api.js');
var LATENCY_PATH = "/utils/latency";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function measureLatencyPromise(socket) {
    return new Promise(function(resolve, reject) {
        var latency_info = {};
        latency_info.id = getRandomInt(0, 10000);
        latency_info.time = Date.now();

        api.send_to_sc(socket, LATENCY_PATH, latency_info.id);

        api.from_sc(socket, LATENCY_PATH, function(msg) {
            if(latency_info.id == msg[0]) {
                var ms = Date.now() - latency_info.time;
                resolve(ms);
            }
        });
    });
}

function measureLatency(socket, func) {
    measureLatencyPromise(socket).then(function(response) {
        func(response);
    });
}

function measureLatencyAvg(socket, func, num) {
    if(!num) num = 5;
    var sum = 0;
    var times = [];
    var k = 0;
    for(var i = 0; i < num; i++) {
        times.push(measureLatencyPromise(socket));
    }

    var chain = times.reduce(function (previous, item) {
        return previous.then(function (t) {
            sum += t;
            return item;
        });
    });

    chain.then(function (t) {
        func(sum / num);
    });
}

module.exports.measureLatency = measureLatency;
module.exports.measureLatencyAvg = measureLatencyAvg;
