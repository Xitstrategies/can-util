import omit from './omit.js';
import QUnit from '../../test/qunit.js';

QUnit.module("can-util/js/omit");

QUnit.test("Omit properties from an object", function () {
	var source = { a: 1, b: 2, c: 3, d: 4 };
	var propsToOmit = ['b', 'd'];
	var expected = { a: 1, c: 3 };
	var actual = omit(source, propsToOmit);
	deepEqual(expected, actual);
});