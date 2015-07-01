
$(function() {

	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});

    $('[data-toggle="popover"]').popover({
    	container: 'body'
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

	$('.step5').on('click', '#shareMapBtn', function() {
		$.post('/api/mapPublish');
		makeUnPublishBtnVisible();
	});

	$('.step5').on('click', '#unShareMapBtn', function() {
		$.post('/api/mapUnPublish');
		$('#shareMapBtn').removeClass('hide');
		$('#unShareMapBtn').addClass('hide');
	});

	aloha.dom.query('.editable', document).forEach(aloha);
});

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

function makePublishStateBtnsVisible() {
	$('.published-state').removeClass('hide');
}

function makeUnPublishBtnVisible() {
	$('#shareMapBtn').addClass('hide');
	$('#unShareMapBtn').removeClass('hide');
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