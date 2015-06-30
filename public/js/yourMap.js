$(function() {
	$.get('/api/getMap', function(map) {
		deserializeMap(JSON.parse(map));
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

function hasValidElements(list) {
	for(i in list)
		if(String(list[i]) !== list[i])
			return false;

	return true;
}