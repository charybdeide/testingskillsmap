var saveTimeout;

$(function () {
	initScrollSpy();

	$.get('/api/getMap', function (data) {
		if (data !== 'null') {
			var parsedData = JSON.parse(data);
			deserializeStep1(parsedData.step1Data);
			deserializeMap(parsedData.map);

			makePublishStateBtnsVisible();

			if (parsedData.isPublished) {
				makeUnPublishBtnVisible();
			}

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
		$(this).closest('li').find(".skill-name").popover('destroy');
		$(this).closest('li').remove();

		resetValidation();
		validateFields();
});

	$('.skillsMap').on('click', '.removeCategory', function () {
		$(this).closest('li').find(".category-name, .skill-name").popover('destroy');

		$(this).closest('li').remove();
		resetValidation();
		validateFields();
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

	$('#mapName').popover({
		content: "Enter your map name here.",
		trigger: "manual",
		container: "body",
		placement: "bottom"
	});

	validateFields();
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
			'category': category,
			'skills': skillsList
		});

		skillsList = [];
	});
	return list;

}

function deserializeMap(record) {
	var name = record.name;
	$('#mapName').val(name);
	if (record.data !== null) {
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

	elm.find('input.category-name').val(name);

	$('.skillsMap').append(elm);

	$(".category-name:last").popover({
		content: "Fill in a category name.",
		trigger: "manual",
		container: "body",
		placement: "right"
	});

	validateFields();

	return elm;
}

function addSkill(category, name) {
	var template = $('#extraSkillTemplate').html();
	var elem = $(template);
	elem.find('input.skill-name').val(name);

	category.children('ul').append(elem);

	category.find(".skill-name:last").popover({
		content: "Fill in a skill name.",
		trigger: "manual",
		container: "body",
		placement: "right"
	});

	validateFields();
}

function saveUserInput() {
	validateFields();
	if($(".empty-field").length !== 0) {
		return;
	}
	clearTimeout(saveTimeout);

	saveTimeout = setTimeout(function () {
		var step1 = $('.step1Editable').html();

		var facts = $('#facts').val();
		var concepts = $('#concepts').val();
		var procedures = $('#procedures').val();
		var cognitiveStrategies = $('#cognitiveStrategies').val();
		var models = $('#models').val();
		var skills = $('#skills').val();
		var attitudes = $('#attitudes').val();
		var metacognition = $('#metacognition').val();

		var name = $('#mapName').val();

		var list = serializeMap($('.skillsMap'));
		$.post('/api/map', {
			step1Data: step1,
			knowledgeDimension: {
				'facts': facts,
				'concepts': concepts,
				'procedures': procedures,
				'cognitiveStrategies': cognitiveStrategies,
				'models': models,
				'skillsTable': skills,
				'attitudes': attitudes,
				'metacognition': metacognition
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

function makeUnPublishBtnVisible() {
	$('#shareMapBtn').addClass('hide');
	$('#unShareMapBtn').removeClass('hide');
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

function makePublishStateBtnsVisible() {
	$('.published-state').removeClass('hide');
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

function resetValidation() {
	$(".category-name").removeClass("empty-field");
	$(".skill-name").removeClass("empty-field");
}

function validateFields() {

	var firstEmptyCategory = $(".category-name.empty-field:first");
	var firstEmptySkill = $(".skill-name.empty-field:first");

	$('.category-name, .skill-name, .mapName').each(function() {
		var val = $(this).val().trim();

		if(val === '') {
			$(this).addClass('empty-field');
		} else {
			$(this).removeClass('empty-field');
		}
	});

	var emptyCategory = $(".category-name.empty-field:first");
	var emptySkill = $(".skill-name.empty-field:first");

	if(!firstEmptyCategory.is(emptyCategory)) {
		firstEmptyCategory.popover("hide");
		emptyCategory.popover("show");
	}

	if(!firstEmptySkill.is(emptySkill)) {
		firstEmptySkill.popover("hide");
		emptySkill.popover("show");
	}

	var action = $('.mapName').is(".empty-field") ? 'show' : 'hide';
	$('.mapName').popover(action);
}
