$(function() {
	$(".startbutton").click(function() {
		//start game
		$("div#start").hide();
		$("div#picturebox").show();
		$("#timer").attr("data-timer", guesstime);
		
		nextImage();
	});
	
	String.prototype.endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
	
});

var lastNew = getCookie("lastSeen");
var currentSource = "";
var timer = null;
var loadedPosts = [];
var guesstime = 25;
var revealtime = 14;

function loadImages(){
	loadedPosts = [];
	
	var jsonURL = "";
	
	if(lastNew == ""){
		jsonURL = "http://www.reddit.com/r/animenocontext/new.json?limit=100&jsonp=?";
	} else {
		jsonURL = "http://www.reddit.com/r/animenocontext/new.json?limit=100&after=" + lastNew + "&jsonp=?";
	}

	$.getJSON(jsonURL,
		function(data) {
			$.each( data, function( key, val ) {
			
			if(key == "data"){
				$.each(data.data.children, function(key2, val2){
				
					//only grab posts with source in title
					if(val2.data.title.indexOf("[") > -1 && val2.data.title.indexOf("[") < val2.data.title.indexOf("]")){
						//filter to images only
						if(val2.data.url.endsWith("png") || val2.data.url.endsWith("jpg") ||val2.data.url.endsWith("gif") || val2.data.url.endsWith("bmp")){
							loadedPosts.push(val2);
						}
					}
					
					lastNew = val2.data.name;
				});
			}
			});
			nextImage();
		});
}

function nextImage(){
	$("#overlay").css("opacity", "0");
	if(loadedPosts.length == 0){
		loadImages();
	} else {
		setCookie("lastSeen", loadedPosts[0].data.name);
		
		$("#picturebox").css("background-image", "url(" + loadedPosts[0].data.url + ")");
		$("#redditlink").attr("href", "http://www.reddit.com" + loadedPosts[0].data.permalink);
			
		//start timer
		timer = setTimeout(timeout, guesstime * 1000);
		$("#timer").TimeCircles().stop();
		$("#timer").TimeCircles().destroy();
		$("#timer").remove();
		$("#picturebox").append("<div id=\"timer\"></div>");
		$("#timer").attr("data-timer", guesstime);
		$("#timer").TimeCircles({count_past_zero: false,total_duration: guesstime,time: {
        Days: { show: false },
        Hours: { show: false },
        Minutes: { show: false },
        Seconds: { color: "#C0C8CF" }
    }});
	}
}

function timeout(){
	revealImage();
}

function revealImage(){
	$("#overlay").css("opacity", "1.0");

	//get source
	var title = loadedPosts[0].data.title;
	currentSource = title.substring(title.indexOf("[") + 1).substring(0, title.indexOf("]") - title.indexOf("[") - 1);
	$("#overlay p").text(currentSource);

	timer = setTimeout(function() {
	loadedPosts.shift();
	
	nextImage();
	}, revealtime * 1000);
	$("#timer").TimeCircles().stop();
	$("#timer").TimeCircles().destroy();
	$("#timer").remove();
	$("#picturebox").append("<div id=\"timer\"></div>");
	$("#timer").attr("data-timer", revealtime);
	$("#timer").TimeCircles({count_past_zero: false,total_duration: revealtime,time: {
        Days: { show: false },
        Hours: { show: false },
        Minutes: { show: false },
        Seconds: { color: "#C0C8CF" }
    }});
}

function setCookie(name, value){
	//expires in a week
	var date = new Date();
	date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
	
    document.cookie = name + "=" + escape(value) + "; expires="+date.toGMTString();
}

function getCookie(name){
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	
	if (parts.length == 2) {
		return parts.pop().split(";").shift();
	} else {
		return "";
	}
}