/*can-util@3.0.0-pre.1#can-util*/
define(function (require, exports, module) {
    var extend = require('./js/deep-extend/deep-extend');
    module.exports = extend({}, require('./dom/dom'), require('./js/js'));
});