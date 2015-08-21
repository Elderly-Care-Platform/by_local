byControllers.controller('DiscussSearchController', ['$scope', '$rootScope', '$location','$route', '$routeParams'
    ,'DiscussSearch', 'DiscussCount','$sce','$timeout', '$window',
    function ($scope, $rootScope, $location ,$route, $routeParams,DiscussPage,
    		DiscussCount,$sce, $timeout, $window) {

        $scope.discussionViews = {};
        $scope.discussionViews.contentPanel = "app/components/discuss/discussContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        
        var queryParams = {p:0,s:10};
        queryParams.term = $routeParams.term;
        

            $("#preloader").show();

            DiscussPage.get(queryParams,
                function (value) {
                    $scope.discuss = value.data.content;
                    $scope.pageInfo = BY.byUtil.getPageInfo(value.data);
                    $scope.pageInfo.isQueryInProgress = false;
                    $("#preloader").hide();
                    function regexCallback(p1, p2,p3,p4) {
             		    return ((p2==undefined)||p2=='')?p1:'<i class="highlighted-text" >'+p1+'</i>';
             		}
                    setTimeout(
             				function(){
             						$(".by_blog_author").each(function(a,b){
             							var myRegExp = new RegExp("<[^>]+>|("+$routeParams.term+")","ig");
             						var result = $(b).html().replace(myRegExp,regexCallback);
             						$(b).html(result);
             						}
             				)},500);
                },
                function (error) {
                    console.log("DiscussAllForDiscussType");
                    alert("error");
                });
            

        $scope.loadMore = function($event){
            if($scope.pageInfo && !$scope.pageInfo.lastPage && !$scope.pageInfo.isQueryInProgress ){
                $scope.pageInfo.isQueryInProgress = true;
                queryParams.p = $scope.pageInfo.number + 1;
                queryParams.s = $scope.pageInfo.size;

                DiscussPage.get(queryParams,
                    function(value){
                        if(value.data.content.length > 0){
                            $scope.pageInfo.isQueryInProgress = false;
                            $scope.discuss = $scope.discuss.concat(value.data.content);
                        }
                        $scope.pageInfo = BY.byUtil.getPageInfo(value.data);
                        $scope.pageInfo.isQueryInProgress = false;
                        function regexCallback(p1, p2,p3,p4) {
                 		    return ((p2==undefined)||p2=='')?p1:'<i class="highlighted-text" >'+p1+'</i>';
                 		}
                        setTimeout(
                 				function(){
                 						$(".by_blog_author").each(function(a,b){
                 							var myRegExp = new RegExp("<[^>]+>|("+$routeParams.term+")","ig");
                 						var result = $(b).html().replace(myRegExp,regexCallback);
                 						$(b).html(result);
                 						}
                 				)},500);
                    },
                    function(error){
                        console.log("DiscussAllForDiscussType");
                    });
            }
        }

        $scope.add = function (type) {
            $scope.discussionViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            window.scrollTo(0, 0);
        };

        $scope.postSuccess = function () {
            $route.reload();
        };
        
        $scope.trustForcefully = function(html) {
            return $sce.trustAsHtml(html);
        };

        $scope.trustAsResourceUrl = function(url) {
            return $sce.trustAsResourceUrl(url);
        };

        $scope.go = function($event, type, id, discussType){
            $event.stopPropagation();
            if(type === "detail"){
                $location.path('/discuss/'+id);
            } else if(type === "menu" && $rootScope.menuCategoryMap){
                var menu = $rootScope.menuCategoryMap[id];
                //$(".selected-dropdown").removeClass("selected-dropdown");
                //$("#" + menu.id).parents(".dropdown").addClass("selected-dropdown");
                if(menu.module===0){
                    $location.path("/discuss/list/"+menu.displayMenuName+"/"+menu.id+"/all");
                }else if(menu.module===1){
                    $location.path("/services/list/"+menu.displayMenuName+"/"+menu.id+"/all/");
                }else{
                    //nothing as of now
                }
            }else if(type === "accordian"){
                $($event.target).find('a').click();
            }else if(type === "comment") {
                $location.path('/discuss/' + id).search({comment: true});
            }
        }

        //angular.element($window).bind("scroll", function() {
        //	$scope.sliderHeight = $(".by_section_header").height();
        //	if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= $scope.sliderHeight){
        //		$(".by_left_panel_homeSlider_position").removeClass('by_left_panel_homeSlider');
        //		$(".by_left_panel_homeSlider_position").css('margin-top', -$scope.sliderHeight+'px');
        //	}else{
        //		$(".by_left_panel_homeSlider_position").addClass('by_left_panel_homeSlider');
        //		$(".by_left_panel_homeSlider_position").css('margin-top', '0px');
        //	}
        //});
        
        //$scope.resize = function(height, width){
        //	if(width > 730){
        //		$(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImage +')');
        //	} else{
        //		$(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImageMobile +')');
        //	}
        //};
 	}]);

