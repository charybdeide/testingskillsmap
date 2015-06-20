$(function(){
	$("#aboutBtn").click(function()
	{
		$(".aboutContent").removeClass("hide");
    	$(".description").addClass("hide");
	});
	$("#startBtn").click(function()
	{
		$(".makeMapContent").removeClass("hide");
    	$(".description").addClass("hide");
	});
	$('[data-toggle="tooltip"]').tooltip({
    container : 'body'
  	});
  	$("#addCategory").click(function()
  	{
  		$(".skillsMap").append($("#categoryTemplate").html());
  		$(".category:last-of-type").append($("#skillTemplate").html());
  	});

});