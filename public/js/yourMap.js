var saveTimeout;

$(function () {
	initScrollSpy();

	$.get('/api/getMap', function (data) {
		if (data != 'null') {
			var parsedData = JSON.parse(data);
			deserializeStep1(parsedData.step1Data);
			deserializeMap(parsedData.map);
			makePublishStateBtnsVisible();
			if (parsedData.isPublished) makeUnPublishBtnVisible();

			deserializeKnowledgeDimension(parsedData.knowledgeDimension);
		}
	});

	$('#addCategory').click(function () {
		var category = addCategory();
		addSkill(category);
	});

	$('.skillsMap').on('click', '.addSkill', function () {
		addSkill($(this).closest('li'));
	});

	$('.skillsMap').on('click', '.removeSkill', function () {
		$(this).closest('li').remove();
	});

	$('.skillsMap').on('click', '.removeCategory', function () {
		$(this).closest('li').remove();
	});

	$('body').on('keyup', '.saveOnKeyPress', function () {
		$(this).closest('.input-group').addClass('has-warning');
		saveUserInput();
	});

	$('body').on('click', '.saveOnClick', function () {
		saveUserInput();
	});

	$('.skillsMap').on('click', '.saveOnClick', function () {
		saveUserInput();
	});

	$('.map-full-screen').click(function () {
		$('body').toggleClass('fullscreen-map');
	});
});

function serializeMap(rootElement) {
	var list = [];
	var skillsList = [];
	$('.skillsMap .category-name').each(function () {
		var category = $(this).val();

		$(this).closest('li').find('.skill-name').each(function () {
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
	var name = record.name;
	$('#mapName').val(name);
	if (record.data != null) {
		var numberOfCategories = record.data.length;
		for (i = 0; i < numberOfCategories; i++) {
			var category = addCategory(record.data[i].category);
			var numberOfSKills = record.data[i].skills.length;
			for (j = 0; j < numberOfSKills; j++)
				addSkill(category, record.data[i].skills[j]);
		}
	}
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

function saveUserInput() {
	clearTimeout(saveTimeout);

	saveTimeout = setTimeout(function () {
		var step1 = $('.step1Editable').html();

		var facts = $("#facts").val();
		var concepts = $("#concepts").val();
		var procedures = $("#procedures").val();
		var cognitiveStrategies = $("#cognitiveStrategies").val();
		var models = $("#models").val();
		var skills = $("#skills").val();
		var attitudes = $("#attitudes").val();
		var metacognition = $("#metacognition").val();

		var name = $('#mapName').val();

		var list = serializeMap($('.skillsMap'));
		$.post('/api/map', {
			step1Data: step1,
			knowledgeDimension: {
				"facts": facts,
				"concepts": concepts,
				"procedures": procedures,
				"cognitiveStrategies": cognitiveStrategies,
				"models": models,
				"skillsTable": skills,
				"attitudes": attitudes,
				"metacognition": metacognition
			},
			map: {
				name: name,
				data: list
			}
		}, function ( /* data, status */) {
			$('.input-group.has-warning, .editable.has-warning').removeClass('has-warning');
		});

		makePublishStateBtnsVisible();

	}, 1000);
}

function deserializeStep1(data) {
	$('.step1Editable').html(data);
}

function initScrollSpy() {
	var $window = $(window);
	var $body = $(document.body);

	$body.scrollspy({
		target: '.bs-docs-sidebar'
	});

	$window.on('load', function () {
		$body.scrollspy('refresh');
	});

	$(".bs-docs-sidebar a[href^='#']").on('click', function (e) {
		e.preventDefault();
		var hash = this.hash;
		$('html, body').animate({
			scrollTop: $(hash).offset().top
		}, 300, function () {
			window.location.hash = hash;
		});
	});
}

function deserializeKnowledgeDimension(data) {
	$('#facts').val(data.facts);
	$('#concepts').val(data.concepts);
	$('#procedures').val(data.procedures);
	$('#cognitiveStrategies').val(data.cognitiveStrategies);
	$('#models').val(data.models);
	$('#skills').val(data.skillsTable);
	$('#attitudes').val(data.attitudes);
	$('#metacognition').val(data.metacognition);
}