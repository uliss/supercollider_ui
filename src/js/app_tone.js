var audio = require('./audio.js');
var osc = new audio.AudioToneGenerator();
var global_freq = 442;
var socket = null;
var api = require('./api.js');

function tone_run_oscil() {
    $(document).on('change', 'input:radio[id^="frequency_"]', function (event) {
        global_freq = parseFloat($(this).prop('value'));
        osc.setFreq(global_freq);
        api.forward(socket, "/sc/utils/osc", "set", "freq", global_freq);
    });

    // button play local
    $("#playLocal").click(function() {
        var $this = $(this);
        $this.toggleClass('btn-default');
        if(osc.isPlaying()) {
            osc.stop();
            $this.removeClass("btn-success");
        }
        else {
            osc.play();
            $this.addClass("btn-success");
        }
    });

    // button play server
    $("#playServer").click(function() {
        var $this = $(this);
        $this.toggleClass('btn-primary');
        if($this.hasClass('btn-primary')) {
            socket.emit("/forward", ["/sc/utils/osc", "play", global_freq]);
        }
        else {
            socket.emit("/forward", ["/sc/utils/osc", "stop"]);
        }
    });
}

function tone_run_latency() {
    //- var latency_info = {};
    //-
    //- $("#getLatency").click(function() {
    //-     function getRandomInt(min, max) {
    //-         return Math.floor(Math.random() * (max - min)) + min;
    //-     }
    //-
    //-     latency_info.id = getRandomInt(0, 1000);
    //-     latency_info.time = Date.now();
    //-     socket.emit("/forward", ["/sc/utils/latency", latency_info.id]);
    //- });
    //-
    //- socket.on('/cli/utils/latency', function(msg){
    //-     if(latency_info.id == msg[0]) {
    //-         var ms = Date.now() - latency_info.time;
    //-         $("#latencyLabel").text(ms + ' ms');
    //-     }
    //- });
}

function tone_run() {
    $(document).ready(function() {
        tone_run_oscil();
    });
}

function tone_init(io_socket) {
    socket = io_socket;
}

module.exports.init = tone_init;
module.exports.run = tone_run;
