
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
    //localStorage.setItem("SessionId", "");
    //localStorage.setItem("USER_ID", "");
    //localStorage.setItem("USER_NAME", "");
    //
    //var element = document.getElementById("login_placeholder");
    //if(element){
		//element.innerHTML = "";
	 //   element.href = "";
	 //   document.getElementById("login_placeHolder_li").style.display = "none";
    //}
    //var pro = document.getElementById('profile_placeholder');
    //if(pro){
    //	pro.innerHTML = "Join us";
    //    pro.href = apiPrefix+"#!/users/login";
    //   // window.location = "#!users/home";
    //}
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
	$(".topScroll").css('bottom',  "8px");
	
	
});

$(document).ready(function() {
	$(".topScroll").click(function(){
		
		$('html, body').animate({
            scrollTop: 0
        }, 800);
		
	});
	
	var clientHeight = $( window ).height();
	$(".by_subMenuPlus").css('min-height', (clientHeight - 57)+"px");
	$("ng-view").css('min-height', clientHeight+"px");
	$(".contentPanel").css('min-height', clientHeight+"px");
	
	
});



BY.byUtil.updateMetaTags = function(param){
	 var title = param.title.trim(),
		 imageUrl = param.imageUrl || "http://www.beautifulyears.com/assets/img/logo-fb.jpg",
		 description = $(param.description).text().trim(),
		 keywords = param.keywords;
	 
	 if(keywords && keywords.length > 0){
		 keywords = keywords.join(", ");
	 }else{
		 keywords = "Beutifulyears , senior care, ageing";
	 }

	if(!description && description===""){
		description = "Beautiful Years"
	}

	if(!title && title===""){
		title = description;
	}
	
	if(title.indexOf("Beautiful Years") == -1){
		title += " - Beautiful Years";
	}

	document.title = title;
	$("meta[property='og\\:title']").attr("content", title);
	$("meta[name='twitter\\:title']").attr("content", title);
	$("meta[property='og\\:description']").attr("content", description);
	$("meta[name='description']").attr("content", description);
	$("meta[name='twitter\\:description']").attr("content", description);
	$("meta[property='og\\:image']").attr("content", imageUrl);
	$("meta[name='twitter\\:image']").attr("content", imageUrl);
	$('meta[name=keywords]').attr('content', keywords);
	if(imageUrl != null && imageUrl !== ""){
		var tmpImg = new Image();
		tmpImg.src=imageUrl;
		$(tmpImg).on('load',function(){
			$("meta[property='og\\:image\\:width']").attr("content", tmpImg.width);
			$("meta[property='og\\:image\\:height']").attr("content", tmpImg.height);
		});
		$("meta[property='og\\:image\\:width']").attr("content", imageUrl);
	}
}



BY.byUtil.getImage = function(sharedObj,needAbsolutePath){
	var picture = sharedObj.articlePhotoFilename ? sharedObj.articlePhotoFilename.original: "";
	if(picture && picture!==""){
       if(needAbsolutePath){
    	   picture = picture.substr(1);
           picture = window.location.origin + window.location.pathname + picture;
       }
    }else if(sharedObj.linkInfo && sharedObj.linkInfo.mainImage){
    	picture = sharedObj.linkInfo.mainImage;
    }else if(sharedObj.linkInfo && sharedObj.linkInfo.otherImages && sharedObj.linkInfo.otherImages.length > 0){
    	picture = sharedObj.linkInfo.otherImages[0];
    }
	return picture;
}

BY.byUtil.validateUserName = function(userName){
	if(!userName || userName.trim()==="" ||  userName==="null"){
		userName = "Anonymous";
	}
	return userName;
}


