var inherits = require('inherits');
var box = require('./box.js');

function VBox(params) {
    box.Box.call(this, params);
    this.element.addClass("ui-layout-vbox");
}

inherits(VBox, box.Box);

function create(params) {
    return new VBox(params);
}

module.exports.VBox = VBox;
module.exports.create = create;
