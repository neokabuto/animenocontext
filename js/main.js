$(function() {
	$(".startbutton").click(function() {
		//start game
		$("div#start").hide();
		$("div#picturebox").show();
		
		nextImage();
	});
	
	
});

var lastNew = "";
var currentSource = "";

var loadedPosts = []

function loadImages(){
	var jsonURL = "";
	
	if(lastNew == ""){
		jsonURL = "http://www.reddit.com/r/animenocontext/new.json?jsonp=?";
	} else {
		jsonURL = "http://www.reddit.com/r/animenocontext/new.json?jsonp=?after=" + lastNew;
	}

	$.getJSON(jsonURL,
		function(data) {
			$.each( data, function( key, val ) {
			
			if(key == "data"){
				$.each(data.data.children, function(key2, val2){
					loadedPosts.push(val2);
					lastNew = val2.id;
				});
			}
			});
		  
			nextImage();
		});
}

function nextImage(){
	if(loadedPosts.length == 0){
		loadImages();
	} else {
		$("#picturebox").css("background-image", "url(" + loadedPosts[0].data.url + ")");
	}
}