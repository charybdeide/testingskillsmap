$(function(){
	$("#startBtn").click(function()
	{
		$(".content").removeClass("hide");
    	$(".description").addClass("hide");
	});
	$('[data-toggle="tooltip"]').tooltip({
    container : 'body'
    
  	});

});