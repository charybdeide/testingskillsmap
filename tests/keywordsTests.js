'use strict';
var assert = require('assert');
var map = require('../src/maps/data.js');

describe('Map data operations', function () {

	it('should return empty list when no skills are stored', function() {
		var result = map.getSkills([{category: 'cat1', skills: ''}, {category: 'cat2', skills: ''}]);
		assert.equal(result.length, 0);
	});

	it('should return the list of skills from all categories from the map', function() {
		var result = map.getSkills([{category: 'cat1', skills: ['cat1-s1', 'cat1-s2', 'cat1-s3']}, {category: 'cat2', skills: ['cat2-s1', 'cat2-s2', 'cat2-s3']}]);
		var list = ['cat1-s1', 'cat1-s2', 'cat1-s3', 'cat2-s1', 'cat2-s2', 'cat2-s3'];
		assert.deepEqual( result, list);
	});
});
