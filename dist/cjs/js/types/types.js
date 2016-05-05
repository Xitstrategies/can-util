/*can-util@3.0.0-pre.13#js/types/types*/
var isPromise = require('../is-promise/is-promise.js');
var types = {
    isMapLike: function () {
        return false;
    },
    isListLike: function () {
        return false;
    },
    isPromise: function (obj) {
        return isPromise(obj);
    },
    isConstructor: function (func) {
        if (typeof func !== 'function') {
            return false;
        }
        for (var prop in func.prototype) {
            return true;
        }
        return false;
    },
    isCallableForValue: function (obj) {
        return typeof obj === 'function' && !types.isConstructor(obj);
    },
    isCompute: function (obj) {
        return obj && obj.isComputed;
    },
    DefaultMap: null,
    DefaultList: null
};
module.exports = types;