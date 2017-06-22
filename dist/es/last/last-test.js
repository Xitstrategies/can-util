import QUnit from '../../test/qunit.js';
import last from './last.js';

QUnit.module("can-util/js/last");

QUnit.test("basics", function () {
	QUnit.equal(last(["a", "b"]), "b");
});