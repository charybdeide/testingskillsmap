$(function() {
	$(window).resize(function() {
		$(".categories-container").each(function() {
			var height = 0;
			var circles = $(this).find(".published-map-category").length;
			var totalWidth = 0;
			var left = 0;
			
			//find the biggest circle
			$(this).find(".published-map-category").each(function() {
				var h = $(this).height() / 2;
				if(h > height) height = h;
				
				totalWidth += $(this).width();
			});

			$(this).css("height", height);
			
			var availableWidth = $(this).width() - 
								 $(this).find(".published-map-category:first").outerWidth() -
								 $(this).find(".published-map-category:last").outerWidth();
		
			var colSize = availableWidth / (circles - 2);
			
			var emptySpace = $(this).width() - totalWidth;
			//arrange the circles
			if(emptySpace < 0)
			{
				$(this).find(".published-map-category").each(function (i) {
					var w = $(this).outerWidth();

					var top = height - $(this).height() / 2;
					var size = i === 0 || i === circles - 1 ? 0 : (colSize - w) / 2;

					$(this).css({ top: top, left: left + size });

					left += i === 0 ? w : colSize;
				});
			}
			else 
			{
				var marginSpace = emptySpace/2;
				left += marginSpace;
				$(this).find(".published-map-category").each(function (i) {
					var w = $(this).outerWidth();
					var top = height - $(this).height() / 2;
					$(this).css({ top: top, left: left });
					left += w;
				});
			}
	
		});
	}).resize();
});
