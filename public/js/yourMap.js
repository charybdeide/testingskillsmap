$(function() {
	
	$.get('/api/getMap', function(map) {
		deserializeMap(JSON.parse(map));
	});

	$('#addCategory').click(function() {
		var category = addCategory();
		addSkill(category);
	});

	$('.skillsMap').on('click', '.addSkill', function() {
		addSkill($(this).closest('li'));
	});

	$('.skillsMap').on('click', '.removeSkill', function() {
		$(this).closest('li').remove();
	});

	$('.skillsMap').on('click', '.removeCategory', function() {
		$(this).closest('li').remove();
	});

	$('#mySection').on('click', '#downloadBtn', function() {
		var list = serializeMap($('.skillsMap'));
		console.log(JSON.stringify(list));
	});

	$('#mySection').on('click', function() {	
		saveUserMap();
	});

	$('#mySection').on('change', function() {	
		saveUserMap();
	});
	
});

function serializeMap(rootElement) {
	var list = [];
	var skillsList = [];
	$('.skillsMap .category-name').each(function() {
		var category = $(this).val();

		$(this).closest('li').find('.skill-name').each(function() {
			var skill = $(this).val();
			skillsList.push(skill);
		});

		list.push({
			"category": category,
			"skills": skillsList
		});
		
		skillsList = [];
	});
	return list;
	
}

function deserializeMap(record) {
	var name = record.mapName;
	$('#mySection').children('input').val(name);

	var numberOfCategories = record.mapData.length;
	for(i = 0; i < numberOfCategories; i++)
	{
		var category = addCategory(record.mapData[i].category);
		var numberOfSKills = record.mapData[i].skills.length;
		for(j = 0; j < numberOfSKills; j++)
			addSkill(category, record.mapData[i].skills[j]);
	}		
	makePublishStateBtnsVisible();
	if(record.isPublished) makeUnPublishBtnVisible();

}

function addCategory(name) {
	var template = $('#categoryTemplate').html();
	var elm = $(template);

	elm.find("input.category-name").val(name);
	
	$('.skillsMap').append(elm);

	return elm;
}

function addSkill(category, name) {
	var template = $('#extraSkillTemplate').html();
	var elem = $(template);
	elem.find('input.skill-name').val(name);

	category.children('ul').append(elem);

}

function saveUserMap() {
	{	
		var name = $('#mySection').children('input').val();

		var list = serializeMap($('.skillsMap'));
		$.post('/api/map', {
			mapName: name,
			mapData: list
		}, function( /* data, status */ ) {
		});
		makePublishStateBtnsVisible();
	}
}