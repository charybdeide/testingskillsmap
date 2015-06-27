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
	var categoriesNumber = $(".skillsMap").children("li").length;
	for(i = 1; i <= categoriesNumber; i++)
	{
		var category = $(".skillsMap li:nth-child("+ i +")").children("input").val();
		var skillsNumber = $(".skillsMap li:nth-child("+ i +") ul").children("li").length;
		for(j = 1; j <= skillsNumber; j++)
		{
			var skill =  $(".skillsMap li:nth-child("+ i +") ul li:nth-child("+j+")").children("input").val();
			skillsList.push(skill);
		}
		list.push({
			"category": category,
			"skills": skillsList
		});
		skillsList = [];
		
	}
	
	return list;
	
}

function hasValidElements(list) {
	for(i in list)
		if(String(list[i]) !== list[i])
			return false;

	return true;
}