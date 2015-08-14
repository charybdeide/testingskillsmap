'use strict';
var assert = require("assert");
var mapData = require("../src/maps/index.js");

describe('Maps browse preview', function () {

	it('should return no categories data when only map name is not empty', function() {
		var result = mapData.previewMaps({_id: "1", map: {name: "map name", data: [{category: "", _id:"11", skills:[""]}]}});
		assert.equal([{id: "1", name: "map name"}], result);
	})

	it('should return no categories data when there are no categories in the map', function() {
		var result = mapData.previewMaps({_id: "1", map: {name: "map name", data: []}});
		assert.equal([{id: "1", name: "map name"}], result);
	})

	it('should return categories data when the categories have no name', function() {
		var result = mapData.previewMaps({_id: "1", map: {name: "map name", data: [{category: "", _id:"11", skills:["s1", "s2"]}]}});
		assert.equal([{id: "1", name: "map name", categories: [{categoryWidth: 4, categoryName: ""}]}], result);
	})
	
	it('should return larger categories width when there are more skills in those categories', function() {
		var result = mapData.previewMaps({_id: "1", map: {name: "map name", data: [{category: "cat1", _id:"11", skills:["s1", "s2"]}, {category: "cat2", _id:"12", skills:["s1", "s2", "s3", "s4", "s5"]}]}});
		assert.equal([{id: "1", name: "map name", categories: [{categoryWidth: 4, categoryName: "cat1"}, {categoryWidthStep: 10, categoryName: "cat2"}]}], result);
	})
	
	it('should not return a category width of more than 90% of the available length', function() {
		var skillsList = [];
		for(i = 0; i < 50; i++)
		{
			skillsList.push("skill " + i);
		}
		var result = mapData.previewMaps({_id: "1", map: {name: "map name", data: [{category: "cat1", _id:"11", skills: skillsList}]}});
		assert.equal([{id: "1", name: "map name", categories: [{categoryWidth: 90, categoryName: "cat1"}]}], result);
	})
	
});


