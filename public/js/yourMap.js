(function(exports) {

	exports.check = function(rootElement)
	{
		//TO DO: to check if content is valid
		return serializeMap(rootElement);
		
	}

})(typeof exports === 'undefined' ? this['yourMap'] = {} : exports);

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

function hasValidElements(list) {
	for(i in list)
		if(String(list[i]) !== list[i])
			return false;

	return true;
}