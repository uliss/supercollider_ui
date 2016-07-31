var audio = require('./audio.js');
var api = require('./api.js');

var oscil = new audio.AudioToneGenerator();
var global_freq = 442;
var socket = null;
var OSCIL_PATH = "/utils/osc";
var LATENCY_PATH = "/utils/latency";
var latency_info = {};

function tone_run_oscil() {
    $(document).on('change', 'input:radio[id^="frequency_"]', function (event) {
        global_freq = parseFloat($(this).prop('value'));
        oscil.setFreq(global_freq);
        api.send_to_sc(socket, OSCIL_PATH, "set", "freq", global_freq);
    });

    // button play local
    $("#playLocal").click(function() {
        var $this = $(this);
        $this.toggleClass('btn-default');
        if(oscil.isPlaying()) {
            oscil.stop();
            $this.removeClass("btn-success");
        }
        else {
            oscil.play();
            $this.addClass("btn-success");
        }
    });

    // button play server
    $("#playServer").click(function() {
        var $this = $(this);
        $this.toggleClass('btn-primary');
        if($this.hasClass('btn-primary')) {
            api.send_to_sc(socket, OSCIL_PATH, "play", global_freq);
        }
        else {
            api.send_to_sc(socket, OSCIL_PATH, "stop");
        }
    });
}

function tone_run_latency() {
    // button
    $("#getLatency").click(function() {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        latency_info.id = getRandomInt(0, 1000);
        latency_info.time = Date.now();
        api.send_to_sc(socket, LATENCY_PATH, latency_info.id);
    });

    api.from_sc(socket, LATENCY_PATH, function(msg) {
        if(latency_info.id == msg[0]) {
            var ms = Date.now() - latency_info.time;
            $("#latencyLabel").text(ms + ' ms');
        }
    });
}

function tone_run() {
    $(document).ready(function() {
        tone_run_oscil();
        tone_run_latency();
    });
}

function tone_init(io_socket) {
    socket = io_socket;
}

module.exports.init = tone_init;
module.exports.run = tone_run;
