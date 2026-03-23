import test from 'node:test';
import assert from 'node:assert';
import { round2 } from '../../../scripts/modules/utils/units.mjs';

test('round2 - basic rounding', () => {
	assert.strictEqual(round2(1.234, 2), 1.23);
	assert.strictEqual(round2(1.235, 2), 1.24);
	assert.strictEqual(round2(1.236, 2), 1.24);
});

test('round2 - different decimal places', () => {
	assert.strictEqual(round2(1.23456, 1), 1.2);
	assert.strictEqual(round2(1.23456, 3), 1.235);
	assert.strictEqual(round2(1.23456, 4), 1.2346);
});

test('round2 - integers', () => {
	assert.strictEqual(round2(5, 2), 5);
	assert.strictEqual(round2(10, 0), 10);
});

test('round2 - negative numbers', () => {
	assert.strictEqual(round2(-1.234, 2), -1.23);
	assert.strictEqual(round2(-1.235, 2), -1.23); // Math.round(-123.4999...) = -123
	assert.strictEqual(round2(-1.236, 2), -1.24);
});

test('round2 - floating point precision issues', () => {
	// 1.005 * 100 is often 100.49999999999999 in JS
	// (1.005 + Number.EPSILON) * 100 should be >= 100.5
	assert.strictEqual(round2(1.005, 2), 1.01);
});
