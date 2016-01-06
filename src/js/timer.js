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

function TimerControl(element, timer) {
    this.element = element;

    this.start = $("<button>")
    .attr("id", "timerStart")
    .attr("value", 0)
    .text("Start")
    .addClass("btn")
    .addClass("btn-lg")
    .addClass("btn-info")
    .addClass("col-md-4")
    .css("height", "200px")
    .click(function(){
        $(this).toggleClass("active");
        $(this).toggleClass("btn-info");
        $(this).toggleClass("btn-danger");

        if($(this).attr("value") == 1) {
            $(this).text("Start");
            $(this).attr("value", 0);
            timer.stop();
        }
        else {
            $(this).text("Stop");
            $(this).attr("value", 1);
            timer.start();
        }
    })
    .appendTo(this.element);

    $("<div></div>")
    .addClass("col-md-4")
    .appendTo(this.element);

    $("<button>")
    .attr("id", "timerReset")
    .attr("value", 0)
    .text("Reset")
    .addClass("btn")
    .addClass("btn-lg")
    .addClass("btn-warning")
    .addClass("col-md-4")
    .css("height", "200px")
    .click(function(){ timer.reset(); })
    .appendTo(this.element);
}

function ServerTimer(element) {
    this.socketPath = '/timer/server/control';
    element.text(0 .toHHMMSS());

    socket.on('/server/timer', function(msg) {
        element.text(msg);
        console.log(msg);
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

    this.init = function() {

    };

    this.start = function() {

    };

    this.stop = function() {

    };

    this.reset = function() {
        currentTime = 0;
    };

    this.update = function() {
        this.element.text(this.currentTime .toHHMMSS());
    };
}
