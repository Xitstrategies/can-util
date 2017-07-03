'use strict';

var dev = require('../dev/dev');
var hasWarned = false;

/**
 * @module {function} can-util/js/is-string/is-string is-string
 * @parent can-util/js
 * @description Determines if the provided argument is a string.
 * @signature `isString(obj)`
 *
 * ```js
 * var isString = require("can-util/js/is-string/is-string");
 *
 * console.log(isString("foo")); // -> true
 * console.log(isString(String("foo")); // -> true
 *
 * console.log(isString({})); // -> false
 * ```
 *
 * @param {*} obj An object to test if is a string.
 * @return {Boolean} True if the object is a string.
 */
module.exports = function isString(obj){
	//!steal-remove-start
	if (!hasWarned) {
		dev.warn('js/is-string/is-string is deprecated; use typeof x === "string"');
		hasWarned = true;
	}
	//!steal-remove-end

	return typeof obj === 'string';
};
