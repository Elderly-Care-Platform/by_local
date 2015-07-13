
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


BY.byUtil.inValidateSession = function(){
	console.log("invalidating session");
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
        window.location = "#/users/aboutUs";
    }
}