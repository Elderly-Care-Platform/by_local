//DIscuss All
byControllers.controller('DiscussAllController', ['$scope', '$rootScope', '$location','$route', '$routeParams'
    ,'DiscussPage', 'DiscussCount','$sce','$timeout', '$window','broadCastMenuDetail',
    function ($scope, $rootScope, $location ,$route, $routeParams,DiscussPage,
    		DiscussCount,$sce, $timeout, $window, broadCastMenuDetail) {
	    var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);

        $scope.discussionViews = {};
        $scope.discussionViews.leftPanel = "app/components/discuss/discussLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.discussionViews.contentPanel = "app/components/discuss/discussContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.selectedMenu = $rootScope.menuCategoryMap ? $rootScope.menuCategoryMap[$routeParams.menuId] : null;
        $scope.discussType = $routeParams.discussType; //Needed for left side Q/A/P filters

        var tags = [];
        var queryParams = {p:0,s:10};
        
        if($scope.selectedMenu){
        	//console.log($scope.selectedMenu.displayMenuName);

            //Set page title and FB og tags
            (function(){
                var metaTagParams = {
                    title:  $scope.selectedMenu.displayMenuName,
                    imageUrl:   "",
                    description:   ""
                }
                BY.byUtil.updateMetaTags(metaTagParams);
            })();


            tags = $.map($scope.selectedMenu.tags, function(value, key){
                return value.id;
            })

            queryParams.tags = tags.toString();  //to create comma separated tags list
            if($scope.discussType && $scope.discussType.toLowerCase().trim()!=="all"){
                queryParams.discussType = $routeParams.discussType;
            }

            $("#preloader").show();
            DiscussCount.get({tags:tags}, function (counts) {
                    $scope.discuss_counts = counts.data;
                },
                function (error) {
                    console.log(error);
                });


            DiscussPage.get(queryParams,
                function (value) {
                    $scope.discuss = value.data.content;
                    $scope.pageInfo = BY.byUtil.getPageInfo(value.data);
                    $scope.pageInfo.isQueryInProgress = false;
                    $("#preloader").hide();
                },
                function (error) {
                    console.log("DiscussAllForDiscussType");
                    alert("error");
                });
            
        };
        
       $scope.fixedMenuInitialized = function(){
           broadCastMenuDetail.setMenuId($scope.selectedMenu);
       };

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
        //	var leftMenuHeight = $(".by-left-menu").height(),
        //        sliderHeight = $(".homeSlider").height();
        //
        //    if(leftMenuHeight > 0){
        //        //var marginTop = leftMenuHeight - sliderHeight;
        //        //$(".by_left_panel_fixed").css('margin-top', marginTop+'px');
        //    }
        //	//if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= $scope.sliderHeight){
        //	//	$(".by_left_panel_homeSlider_position").removeClass('by_left_panel_homeSlider');
        //	//	$(".by_left_panel_homeSlider_position").css('margin-top', -$scope.sliderHeight+'px');
        //	//}else{
        //     //   $(".by_left_panel_fixed").addClass("by_left_panel_homeSlider_position");
        //	//	$(".by_left_panel_fixed").addClass('by_left_panel_homeSlider');
        //	//	$(".by_left_panel_fixed").css('margin-top', '0px');
        //	//}
        //});
        
        //$scope.resize = function(height, width){
        //	if(width > 730){
        //		$(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImage +')');
        //	} else{
        //		$(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImageMobile +')');
        //	}
        //};
 	}]);


