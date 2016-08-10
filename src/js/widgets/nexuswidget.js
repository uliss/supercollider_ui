var inherits = require('inherits');
var base = require('./base.js');

function NexusWidget(type, params) {
    base.BaseWidget.call(this, params);
    this.nx_widget = nx.add(type, this.params);
    this.nx_widget.label = this.params.label;
    this.nx_widget.oscPath = this.params.oscPath;
    this.nx_widget.colors = $.extend({}, this.nx_widget.colors, this.colorScheme);

    if(this.params.min !== null) this.nx_widget.min = this.params.min;
    if(this.params.max !== null) this.nx_widget.max = this.params.max;

    if(this.params.value !== null) {
        this.nx_widget.val.value = this.params.value;
        this.nx_widget.value = this.params.value;
    }
}

inherits(NexusWidget, base.BaseWidget);

NexusWidget.prototype.show = function() { this.nx_widget.draw(); };

NexusWidget.prototype.bind = function(action, callback) {
    this.nx_widget.on(action, callback);
};

NexusWidget.prototype.bindToValue = function() {
    var $this = this;
    this.nx_widget.on('value', function(data) {
        $this.send(data);
    });
};

function makeSquared(params, defaultSize) {
    if(defaultSize === undefined)
        defaultSize = 100;

    if(params.size !== undefined) {
        params.w = params.h = params.size;
    }
    else {
        params.w = params.h = defaultSize;
    }

    return params;
}

module.exports.NexusWidget = NexusWidget;
module.exports.makeSquared = makeSquared;
