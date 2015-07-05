$(function() {
	$.get('/api/getPublishedMaps', function(maps) {
		var numberOfMaps = JSON.parse(maps).length;
		for(i = 0; i < numberOfMaps; i++)
		{
			var map = JSON.parse(maps)[i];
			deserializePublishedMap(map);
		}
			
	});
});


function deserializePublishedMap(record) {
	var name = record.mapName;
	var mapElem = addMapName(name);
	
	var categoriesNo = record.mapData.length;
	for(j = 0 ; j < categoriesNo; j++) {
		var catName = record.mapData[j].category;
		var mapCatElem = addMapCategory(mapElem, catName);
		var skillsNo = record.mapData[j].skills.length;
		for(t = 0; t < skillsNo; t++){
			var skillName = record.mapData[j].skills[t];
			if (skillName != "") addMapSKill(mapCatElem, skillName);
		}
	}
}

function addMapName(name) {
	var template = $('#publishedMapNameTemplate').html();
	var elem = $(template);
	elem.children('.title').html(name);
	$('#mapsSection').append(elem);
	return elem;

}

function addMapCategory(map, catName) {
	var template = $('#publishedMapCategoryTemplate').html();
	var elem = $(template);
	elem.find('.category-name').html(catName);
	map.children('ul').append(elem);
	return elem;
}

function addMapSKill(category, skillName) {
	var template = $('#publishedMapSkillTemplate').html();
	var elem = $(template);
	elem.find('.skill-name').html(skillName);
	category.children('ul').append(elem);
}