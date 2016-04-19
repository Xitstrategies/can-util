var isFunction = require("../is-function/");

module.exports = function(obj){
	return !!obj && (
		(window.Promise && (obj instanceof Promise)) ||
		(isFunction(obj.then) && isFunction(obj.catch)/*&& (can.List === undefined || !(obj instanceof can.List))*/ )
	);
};
