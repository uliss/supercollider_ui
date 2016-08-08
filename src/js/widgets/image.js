var inherits = require('inherits');
var jqw = require('./jqwidget.js');

function Image(params) {
    jqw.JQueryWidget.call(this, "div", params);
    this.element.addClass("image");

    var img = $("<img/>")
    .attr("src", params.url)
    .attr("id", params.idx);

    if(params.width) img.attr("width", params.width);
    if(params.height) img.attr("height", params.height);

    img.appendTo(this.element);
}

inherits(Image, jqw.JQueryWidget);

function create(params) {
    return new Image(params);
}

module.exports.Image = Image;
module.exports.create = create;
