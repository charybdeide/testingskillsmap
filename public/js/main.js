$(function(){

	$("#loginBtn").click(function()
	{
		//$(".aboutContent").removeClass("hide");
    //	$(".description").addClass("hide");

	});
	$("#startBtn").click(function()
	{
		//$(".makeMapContent").removeClass("hide");
    //	$(".description").addClass("hide");
      var url = window.location.href + "createMap.html";
      window.location.href = url;
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
  		
  });
  
  $("#mySection").on("click", "#saveBtn", function(event) {
    
    var name = String($("#mySection").children("input").val());
    
    var list = [];
    var list = yourMap.check($(".skillsMap"));

    
    $.post("/api/map", {mapName: name, mapData:list}, function(data, status) {
    })  
      

    });


});

