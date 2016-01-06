function httpGet(req, res) {
    res.sendFile(__dirname + '/build/timer.html');
}

function ServerTimer(io, socket_path) {
    this.io = io;
    this.socketPath = socket_path;
    this.currentTime = 0;
    this.timerId = null;
}

ServerTimer.prototype.isRunning = function() {
    return this.timerId != null;
}

ServerTimer.prototype.current = function() {
    return this.currentTime .toHHMMSS()
}

ServerTimer.prototype.reset = function() {
    this.currentTime = 0;
    this.io.emit(this.socketPath, this.current());
}

ServerTimer.prototype.next = function() {
    this.currentTime++;
    this.io.emit(this.socketPath, this.current());
}

ServerTimer.prototype.start = function() {
    if(this.timerId != null)
        return;

    var self = this;
    this.timerId = setInterval(function(){
        self.next(this.socketPath);
    }, 1000);
}

ServerTimer.prototype.stop = function() {
    clearInterval(this.timerId);
    this.timerId = null;
}

function ClientTimer(io, socketPath) {
    ServerTimer.call(this, io, socketPath);
    syncTimeout = 5;
}

ClientTimer.prototype = Object.create(ServerTimer.prototype);
ClientTimer.prototype.constructor = ClientTimer;

ClientTimer.prototype.next = function(speed) {
    this.currentTime++;
    if(this.currentTime % this.syncTimeout == 0) {
        this.io.emit(this.socketPath, this.current());
    }
};

function control(timer, msg) {
    switch(msg) {
        case 'reset':
            timer.reset();
        break;
        case 'start':
            timer.start();
        break;
        case 'stop':
            timer.stop();
        break;
    }
}

module.exports.httpGet = httpGet;
module.exports.control = control;
module.exports.ServerTimer = ServerTimer;
module.exports.ClientTimer = ClientTimer;
