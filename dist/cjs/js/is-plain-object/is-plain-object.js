/*can-util@3.0.0-pre.1#js/is-plain-object/is-plain-object*/
var core_hasOwn = Object.prototype.hasOwnProperty;
function isWindow(obj) {
    return obj !== null && obj == obj.window;
}
function isPlainObject(obj) {
    if (!obj || typeof obj !== 'object' || obj.nodeType || isWindow(obj)) {
        return false;
    }
    try {
        if (obj.constructor && !core_hasOwn.call(obj, 'constructor') && !core_hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
            return false;
        }
    } catch (e) {
        return false;
    }
    var key;
    for (key in obj) {
    }
    return key === undefined || core_hasOwn.call(obj, key);
}
module.exports = isPlainObject;