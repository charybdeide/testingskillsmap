/*global yourMap:false */
$(function() {

	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});

	$('#addCategory').click(function() {
		$('.skillsMap').append($('#categoryTemplate').html());
		$('.category:last-of-type').append($('#initialSkillsTemplate').html());
	});

	$('.skillsMap').on('click', '.addSkill', function() {
		$(this).parent().children('ul').append($('#extraSkillTemplate').html());
	});

	$('.skillsMap').on('click', '.removeSkill', function() {
		$(this).closest('li').remove();
	});

	$('.skillsMap').on('click', '.removeCategory', function() {
		$(this).closest('li').remove();
	});

	$('#mySection').on('click', '#downloadBtn', function() {
		var list = yourMap.check($('.skillsMap'));
		console.log(JSON.stringify(list));
	});

	$('#mySection').on('click', '#saveBtn', function() {
		var name = String($('#mySection').children('input').val());

		var list = yourMap.check($('.skillsMap'));
		$.post('/api/map', {
			mapName: name,
			mapData: list
		}, function( /* data, status */ ) {
			alert('saved!');
		});
	});
});
