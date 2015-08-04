
var BY = BY || {};
BY.byUtil = {};

BY.byUtil.getPageInfo = function(data){
	var ret = {};
	ret.sort = data.sort;
	ret.numberOfElements = data.numberOfElements;
	ret.size = data.size;
	ret.number = data.number;
	ret.totalElements = data.totalElements;
	ret.totalPages = data.totalPages;
	ret.firstPage = data.firstPage;
	ret.lastPage = data.lastPage;
	return ret;
}

BY.byUtil.getAverageRating = function(value){
	var range = parseInt(BY.config.profile.rate.upperLimit) - parseInt(BY.config.profile.rate.lowerLimit);
	var averageRating = null;
	value = parseFloat(value);
	if(value > 0){
		averageRating = (value*range / 100).toFixed(1);
	}

	//Number((parseFloat("22.33333333")*10/100).toFixed(1));

	return averageRating
}



BY.byUtil.inValidateSession = function(){
	localStorage.setItem("SessionId", "");
	localStorage.setItem("USER_ID", "");
	localStorage.setItem("USER_NAME", "");
	
	var element = document.getElementById("login_placeholder");
	if(element){
		element.innerHTML = "";
	    element.href = "";
	    document.getElementById("login_placeHolder_li").style.opacity = "0";
	}
    var pro = document.getElementById('profile_placeholder');
    if(pro){
    	pro.innerHTML = "JOIN US";
        pro.href = apiPrefix+"#/users/login";
       // window.location = "#/users/home";
    }
}

$(window).scroll(function(){
	var windowHeight = $(window).height()/2;

	if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) > windowHeight){
		$(".topScroll").show();
	}else
	{
		$(".topScroll").hide();
	}
	
	////////////////
	
	var footerv1Height = $(".footer-v1").height()+10;
	$(".topScroll").css('bottom', footerv1Height +"px");
	
	
});

$(document).ready(function() {
	$(".topScroll").click(function(){
		
		$('html, body').animate({
            scrollTop: 0
        }, 800);
		
	});

});



BY.byUtil.updateMetaTags = function(param){
	 var title = param.title,
		 imageUrl = param.image,
		 description = $(param.description).text();

	document.title = title;
	$("meta[property='og\\:title']").attr("content", title);
	$("meta[property='og\\:description']").attr("content", description);
}
