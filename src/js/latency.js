var utils = require('./utils.js');
var server = require('./server.js');

var LATENCY_PATH = "/utils/latency";

function Latency() {
    this.id = utils.random_int(0, 10000);
    this.time0 = Date.now();
    this.time1 = this.time0;
    this.latency = 0;
}

Latency.prototype.measure = function() {
    this.time1 = Date.now();
    this.latency = this.time1 = time.time0;
};

function promise_measure_latency() {
    return new Promise(function(resolve, reject) {
        var latency_info = new Latency();

        server.send_to_sc(LATENCY_PATH, latency_info.id);
        server.from_sc(LATENCY_PATH, function(msg) {
            if(latency_info.id == msg[0]) {
                latency_info.measure();
                resolve(latency_info);
            }
        });

        setTimeout(function() { reject(new Error("latency timeout!")); }, 1000);
    });
}

function measure_latency(callback) {
    promise_measure_latency()
    .then(
        function(latency_info) {
            callback(latency_info.latency);
        },
        function(error) {
            console.log("[latency.js]" + error.message);
        }
    );
}

function measure_latency_avg(func, num) {
    if(!num) num = 5;
    var sum = 0;
    var times = [];
    var k = 0;
    for(var i = 0; i < num; i++) {
        times.push(promise_measure_latency());
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

module.exports.measure_latency = measure_latency;
module.exports.measure_latency_avg = measure_latency_avg;
