
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