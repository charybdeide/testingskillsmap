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
  		$(".category:last-of-type").append($("#initialSkillsTemplate").html());
  	});

  	$(".skillsMap").on("click", ".addSkill", function(event) {
  		$(this).parent().children("ul").append($("#extraSkillTemplate").html());
  	});

	$(".skillsMap").on("click", ".removeSkill", function(event) {
  		$(this).parent().remove();  		
  	});
  	
	$(".skillsMap").on("click", ".removeCategory", function(event) {
  		$(this).parent().remove();  		
  	});

  	$("#mySection").on("click", "#downloadBtn", function(event) {
  		
  		var list = [];
  		var list = yourMap.check($(".skillsMap"));
  		console.log(JSON.stringify(list));
  		//console.log($(".skillsMap li").children("input").);
  		//console.log($(".skillsMap").children("li").length);
  		//console.log($(".skillsMap li:nth-child(2)").children("input").val());

  		
  	});

  	
});