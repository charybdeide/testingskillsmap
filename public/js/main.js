$(function() {
	initEditorTools();
	
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});

    $('[data-toggle="popover"]').popover({
    	container: 'body'
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
});

document.onreadystatechange = function () {
  var state = document.readyState;
  if (state == 'complete') {
      setTimeout(function(){
         $('#load').addClass('hide');
         $('#step1Editable').removeClass('hide');
      }, 1000);
  }
}

function makePublishStateBtnsVisible() {
	$('.published-state').removeClass('hide');
}

function makeUnPublishBtnVisible() {
	$('#shareMapBtn').addClass('hide');
	$('#unShareMapBtn').removeClass('hide');
}

function initEditorTools() {
	var hideTimeout;

	$(".navbar.navbar-fixed-top .main-menu").after($("#editorTools").html());
	
	aloha.dom.query('.editable', document).forEach(aloha);

	for(var command in aloha.ui.commands) {
		$('#'+command+'Button').on('click', aloha.ui.command(aloha.ui.commands[command]));
	}
	
	aloha.editor.stack.unshift(function(event) {
		if(arguments[0] && arguments[0].type) {
			var t = arguments[0].type;
			clearTimeout(hideTimeout);

			if(t == "keyup") {
				saveUserInput();
			}

			if(t == "leave") {
				hideTimeout = setTimeout(function() {
					$('.headerCreate').hide();
					$('.main-menu').show();
				}, 400);
			}

			if(t == "mouseup") {
				$('.headerCreate').show();
				$('.main-menu').hide();
			}
		}

		return event;
	});
}
