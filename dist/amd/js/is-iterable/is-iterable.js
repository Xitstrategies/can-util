/*can-util@3.9.0-pre.8#js/is-iterable/is-iterable*/
define(function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    module.exports = function (obj) {
        return obj && !!obj[canSymbol.iterator || canSymbol.for('iterator')];
    };
});