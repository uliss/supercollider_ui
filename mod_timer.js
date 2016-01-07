function httpGet(req, res) {
    res.sendFile(__dirname + '/build/timer.html');
}

function ServerTimer(io, socket_path) {
    this.io = io;
    this.socketPath = socket_path;
    this.currentTime = 0;
    this.timerId = null;
    this.debug_ = false;
    this.controlPath = '/timer/server/control';
}

ServerTimer.prototype.isRunning = function() {
    return this.timerId != null;
}

ServerTimer.prototype.debug = function(value) {
    return this.debug_ = value;
}

ServerTimer.prototype.update = function() {
    this.io.emit(this.socketPath, this.currentTime);
}

ServerTimer.prototype.emitControl = function(msg) {
    this.io.emit(this.controlPath, msg);
}

ServerTimer.prototype.reset = function() {
    this.currentTime = 0;
    this.update();
}

ServerTimer.prototype.next = function() {
    this.currentTime++;
    this.update();
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
}

ClientTimer.prototype = Object.create(ServerTimer.prototype);
ClientTimer.prototype.constructor = ClientTimer;

ClientTimer.prototype.next = function() {
    this.currentTime++;
    if(this.currentTime % 5 == 0) {
        this.update();
    }
};

function control(socket, timer, msg) {
    switch(msg) {
        case 'reset':
            timer.reset();
        break;
        case 'start':
            timer.start();
            socket.broadcast.emit(timer.controlPath, msg);
        break;
        case 'stop':
            timer.stop();
            socket.broadcast.emit(timer.controlPath, msg);
        break;
        case 'get':
            timer.update();
            if(timer.isRunning())
                timer.emitControl('start');
            else
                timer.emitControl('stop');
        break;
        case 'debug':
            timer.debug(true);
        break;
    }
}

module.exports.httpGet = httpGet;
module.exports.control = control;
module.exports.ServerTimer = ServerTimer;
module.exports.ClientTimer = ClientTimer;
