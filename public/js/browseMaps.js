$(function() {
	$.get('/api/getPublishedMaps', function(maps) {
		var numberOfMaps = JSON.parse(maps).length;
		for(i = 0; i < numberOfMaps; i++)
		{
			var map = JSON.parse(maps)[i];
			deserializePublishedMap(map);
		}

	});

	$('#mapsSection').on('click', '.resize-map', function() {
		if($(this).html() == "Shrink") {
			$(this).prev().addClass('shrink');
			$(this).prev().removeClass('enlarge');
			$(this).html("Expand");	
		}
		else
		{
			$(this).prev().addClass('enlarge');
			$(this).prev().removeClass('shrink');
			$(this).html("Shrink");	
		}
	});

});


function deserializePublishedMap(record) {
	var name = record.mapName;
	var mapElem = addMapName(name);
	mapElem.children('#mapSvg').each(function () {
		var svg = $(this)[0];
		var s = Snap(svg);
		drawTitle(name, s);

	var colIndex = 0;
	var rowChange = 0;
	var initialCoord = [20, 80];
	var coord = [];
	coord[0] = initialCoord[0];
	coord[1] = initialCoord[1];

	var categoriesNo = record.mapData.length;
	for(j = 0 ; j < categoriesNo; j++) {
		var catName = record.mapData[j].category;
		var mapCatElem = addMapCategory(mapElem, catName);
		var newCoord = drawCategory(catName, s, coord, colIndex);

		coord[0] = newCoord[0];
		coord[1] = newCoord[1];
		var skillsNo = record.mapData[j].skills.length;
		for(t = 0; t < skillsNo; t++){
			var skillName = record.mapData[j].skills[t];
			if (skillName != "") addMapSKill(mapCatElem, skillName);
		}
		/*
		if(colIndex < 2) colIndex++;
		else {
			colIndex = 0;
			rowChange = 1;
		}*/
	}

	});
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

	

function drawTitle(name, s) {
	var xcoord = 15;
	var ycoord = 15;
	var title = s.text(xcoord,ycoord, name);

	var line = s.path(Snap.format("M{x0},{y0}L{x1},{y1}", {
			x0: 20,
			y0: 20,
			x1: 20,
			y1: 80,
		
		}));
		line.attr({
			fill: "none",
			stroke: "#000",
			strokeWidth: 2
		})
	//return [x1, y1];
}

function drawCategory(name, s, coord, colIndex) {

	var line = s.path(Snap.format("M{x0},{y0}L{x1},{y1}L{x2},{y2}", {
			x0: coord[0],
			y0: coord[1],
			x1: coord[0] + 200,
			y1: coord[1],
			x2: coord[0] + 200,
			y2: coord[1] + 20
		}));
		line.attr({
			fill: "none",
			stroke: "#000",
			strokeWidth: 2
		})
		var title = s.text(coord[0] + 200, coord[1] + 20 + 10, name);
		return [coord[0] + 200, coord[1]];
}