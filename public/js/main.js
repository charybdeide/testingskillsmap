$(function() {
	initEditorTools();
	initStep2();

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
	
	$('#close-btn').on('click', function() {
		$(".btn-info-group.active").click();
	});
});

document.onreadystatechange = function () {
  var state = document.readyState;
  if (state === 'complete') {
      setTimeout(function(){
         $('#load').addClass('hide');
         $('#step1Editable').removeClass('hide');
      }, 1000);
  }
};

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
			console.log(t);
			clearTimeout(hideTimeout);

			if(t === "keyup") {
				saveUserInput();
			}

			if(t == "leave") {
				hideTimeout = setTimeout(function() {
					$('.headerCreate').hide();
					$('.main-menu').show();
				}, 400);
			}

			if(t == "aloha.mouseup") {
				console.log("aici");
				$('.headerCreate').show();
				$('.main-menu').hide();
			}
		}

		return event;
	});
}

function initStep2() {
	$(".btn-info-group").click(function() {
		var group = $(this).attr("data-target");

		$(this).toggleClass("active");
		$(".identify-skills .group." + group).toggleClass("visible");
	})
}
