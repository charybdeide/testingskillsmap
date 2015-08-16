'use strict';
var assert = require("assert");
var mapData = require("../src/maps");


describe('Maps browse preview', function () {

	it('should return no categories data when only map name is not empty', function() {
		var result = mapData.previewMaps([{_id: "1", map: {name: "map name", data: [{category: "", _id:"11", skills:[""]}]}}]);
		assert.deepEqual( result, [{id: "1", name: "map name", categories: []}]);
	})

	it('should return no categories data when there are no categories in the map', function() {
		var result = mapData.previewMaps([{_id: "2", map: {name: "map name", data: []}}]);
		assert.deepEqual( result, [{id: "2", name: "map name", categories: []}]);
	})

	it('should return categories data when the categories have no name', function() {
		var result = mapData.previewMaps([{_id: "1", map: {name: "map name", data: [{category: "", _id:"11", skills:["s1", "s2"]}]}}]);
		assert.deepEqual(result, [{id: "1", name: "map name", categories: [{categoryWidth: 4, categoryName: ""}]}]);
	})
	
	it('should return larger categories width when there are more skills in those categories', function() {
		var result = mapData.previewMaps([{_id: "1", map: {name: "map name", data: [{category: "cat1", _id:"11", skills:["s1", "s2"]}, {category: "cat2", _id:"12", skills:["s1", "s2", "s3", "s4", "s5"]}]}}]);
		assert.deepEqual(result, [{id: "1", name: "map name", categories: [{categoryWidth: 4, categoryName: "cat1"}, {categoryWidth: 10, categoryName: "cat2"}]}]);
	})
	
	it('should not return a category width of more than 90% of the available length', function() {
		var skillsList = [];
		for(var i = 0; i < 50; i++)
		{
			skillsList.push("skill " + i);
		}
		var result = mapData.previewMaps([{_id: "1", map: {name: "map name", data: [{category: "cat1", _id:"11", skills: skillsList}]}}]);
		assert.deepEqual(result, [{id: "1", name: "map name", categories: [{categoryWidth: 90, categoryName: "cat1"}]}]);
	})
	
});


