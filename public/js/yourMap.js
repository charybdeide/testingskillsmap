var saveTimeout;

$(function() {
	initScrollSpy();

	$.get('/api/getMap', function(map) {
		if(map != 'null')
		{
			deserializeStep1(JSON.parse(map));
			deserializeMap(JSON.parse(map));	
		}	
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

	$('body').on('keyup', '.saveOnKeyPress', function() {
		$(this).closest('.input-group').addClass('has-warning');
		saveUserInput();
	});

	$('body').on('click', '.saveOnClick', function() {
		saveUserInput();
	});

	$('.skillsMap').on('click', '.saveOnClick', function() {
		saveUserInput();
	});

	$('.saveEditableOnChange').on('change DOMCharacterDataModified', function() {
		$(this).addClass('has-warning');
		saveUserInput();
	});

	$('body').on('blur keyup paste input', '#step1Editable', function() {
	    var $this = $(this);
	    if ($this.data('before') !== $this.html()) {
	        $this.data('before', $this.html());
	        $this.trigger('change');
	    }
	    saveUserInput();
	    return $this;
	});

	$(window).scroll(function() {
		var step1 = $('.makeMapContent .step1');
		
	    if ($(this).scrollTop() > step1.offset().top + step1.height()) {
			$('.headerCreate').fadeOut();
	     } else {
			 $('.headerCreate').fadeIn();
	     }
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
	if (record.mapData != null)
	{
		var numberOfCategories = record.mapData.length;
		for(i = 0; i < numberOfCategories; i++)
		{
			var category = addCategory(record.mapData[i].category);
			var numberOfSKills = record.mapData[i].skills.length;
			for(j = 0; j < numberOfSKills; j++)
				addSkill(category, record.mapData[i].skills[j]);
		}	
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

function saveUserInput() {
	clearTimeout(saveTimeout);
	
	saveTimeout = setTimeout(function() {	
		var step1 = $('.step1Editable').html();
		
		var facts = $("#facts").val();
		var concepts = $("#concepts").val();
		var procedures = $("#procedures").val();
		var cognitiveStrategies = $("#cognitiveStrategies").val();
		var models = $("#models").val();
		var skills = $("#skills").val();
		var attitudes = $("#attitudes").val();
		var metacognition = $("#metacognition").val();
		var tableList = [];
		tableList.push({
			"facts": facts,
			"concepts": concepts,
			"procedures": procedures,
			"cognitiveStrategies": cognitiveStrategies,
			"models": models,
			"skillsTable": skills,
			"attitudes": attitudes,
			"metacognition": metacognition
		});
	
		var name = $('#mySection').children('input').val();
	
		var list = serializeMap($('.skillsMap'));
		$.post('/api/map', {
			step1Data: step1,
			knowledgeDimensionData: tableList,
			mapName: name,
			mapData: list
		}, function( /* data, status */ ) {
			$('.input-group.has-warning, .editable.has-warning').removeClass('has-warning');
		});
	
		makePublishStateBtnsVisible();

	}, 1000);
}

function deserializeStep1(record) {
	var step1Data = record.step1Data;
	$('.step1Editable').html(step1Data);
}

function initScrollSpy() {
	var $window = $(window);
	var $body   = $(document.body);
	
	$body.scrollspy({
		target: '.bs-docs-sidebar'
	});

	$window.on('load', function () {
		$body.scrollspy('refresh');
	});
	
	$(".bs-docs-sidebar a[href^='#']").on('click', function(e) {
		e.preventDefault();
		var hash = this.hash;
		$('html, body').animate({
			scrollTop: $(hash).offset().top
		}, 300, function() {
			window.location.hash = hash;
		});
	});
}