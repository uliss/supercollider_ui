const gm = require('gm');
const path = require('path');
const fs = require('fs');
const utils = require('./utils');

const appDir = path.dirname(require.main.filename);
var postmsg = utils.postmsg;
var postln = utils.postln;
var node_path = utils.node_path;
var sc_path = utils.sc_path;

module.exports.init = function(){}
