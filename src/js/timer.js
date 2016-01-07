Number.prototype.toHHMMSS = function () {
    var seconds = Math.floor(this),
    hours = Math.floor(seconds / 3600);
    seconds -= hours*3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes*60;

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};

function timerControlSetStarted() {
    $("#timerStart")
    .removeClass("btn-info")
    .addClass("active")
    .addClass("btn-danger")
    .text("Stop")
    .attr("value", 1);
}

function timerControlSetStopped() {
    $("#timerStart")
    .addClass("btn-info")
    .removeClass("active")
    .removeClass("btn-danger")
    .text("Start")
    .attr("value", 0);
}

function TimerControl(element, timer) {
    this.element = element;

    this.start = $("<button>")
    .attr("id", "timerStart")
    .attr("value", 0)
    .text("Start")
    .addClass("btn")
    .addClass("btn-lg")
    .addClass("btn-info")
    .addClass("timer-button")
    .click(function(){
        if($(this).attr("value") == 1) {
            timerControlSetStopped();
            timer.stop();
        }
        else {
            timerControlSetStarted();
            timer.start();
        }
    })
    .appendTo(this.element);

    $("<button>")
    .attr("id", "timerReset")
    .attr("value", 0)
    .text("Reset")
    .addClass("btn")
    .addClass("btn-lg")
    .addClass("btn-warning")
    .addClass("timer-button")
    .click(function(){ timer.reset(); })
    .appendTo(this.element);
}

function ServerTimer(element) {
    this.socketPath = '/timer/server/control';
    var n = 0;
    var self = this;

    element.text(n.toHHMMSS());
    socket.emit(this.socketPath, 'get');

    socket.on(this.socketPath, function(msg){
        console.log(msg);
        switch(msg) {
            case 'start':
            timerControlSetStarted();
            break;
            case 'stop':
            timerControlSetStopped();
            break;
        }
    });

    socket.on('/server/timer', function(msg) {
        element.text(msg .toHHMMSS());
    });

    this.reset = function() {
        socket.emit(this.socketPath, 'reset');
    };

    this.start = function() {
        socket.emit(this.socketPath, 'start');
    };

    this.stop = function() {
        socket.emit(this.socketPath, 'stop');
    };
}

function ClientTimer(element) {
    this.currentTime = 0;
    this.timerId = null;
    this.element = element;
    this.socketPath = '/timer/client/control';
    socket.emit(this.socketPath, 'debug');

    var self = this;
    socket.on('/client/timer', function(msg) {
        self.currentTime = msg;
        self.update();
    });


    this.start = function() {
        var self = this;
        this.timerId = setInterval(function(){
            self.next();
        }, 1000);

        socket.emit(this.socketPath, 'start');
    };

    this.stop = function() {
        clearInterval(this.timerId);
        socket.emit(this.socketPath, 'stop');
    };

    this.reset = function() {
        this.currentTime = 0;
        this.update();
        socket.emit(this.socketPath, 'reset');
    };

    this.update = function() {
        this.element.text(this.currentTime .toHHMMSS());
    };

    this.next = function() {
        this.currentTime++;
        this.update();
    };

    this.update();
}
