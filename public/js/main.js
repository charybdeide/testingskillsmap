$(function() {

	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});

    $('[data-toggle="popover"]').popover({
    	container: 'body'
    });

    aloha.dom.query('.editable', document).forEach(aloha);

    for(var command in aloha.ui.commands)
	{
		$('#'+command+'Button').on('click', aloha.ui.command(aloha.ui.commands[command]));
	}

	$('.step5').on('click', '#shareMapBtn', function() {
		$.post('/api/mapPublish');
		makeUnPublishBtnVisible();
	});

	$('.step5').on('click', '#unShareMapBtn', function() {
		$.post('/api/mapUnPublish');
		$('#shareMapBtn').removeClass('hide');
		$('#unShareMapBtn').addClass('hide');
	});
	
});

document.onreadystatechange = function () {
  var state = document.readyState;
  if (state == 'complete') {
      setTimeout(function(){
         $('#load').addClass('hide');
         $('#step1Editable').removeClass('hide');
      },1000);
  }
}

function makePublishStateBtnsVisible() {
	$('.published-state').removeClass('hide');
}

function makeUnPublishBtnVisible() {
	$('#shareMapBtn').addClass('hide');
	$('#unShareMapBtn').removeClass('hide');
}

