//DIscuss All
byControllers.controller('DiscussAllController', ['$scope', '$rootScope', '$location','$route', '$routeParams'
    ,'DiscussPage', 'DiscussCount','$sce','$timeout', '$window',
    function ($scope, $rootScope, $location ,$route, $routeParams,DiscussPage,
    		DiscussCount,$sce, $timeout, $window) {
	    var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);

        $scope.discussionViews = {};
        $scope.discussionViews.leftPanel = "app/components/discuss/discussLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.discussionViews.contentPanel = "app/components/discuss/discussContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.selectedMenu = $rootScope.menuCategoryMap ? $rootScope.menuCategoryMap[$routeParams.menuId] : null;
        $scope.discussType = $routeParams.discussType; //Needed for left side Q/A/P filters

        var tags = [];
        var queryParams = {p:0,s:10};
        
        $scope.updateSectionHeader = function(){
        	var menuName = $scope.selectedMenu.displayMenuName.toLowerCase().trim();
        	$scope.sectionHeader = BY.config.sectionHeader[menuName];
        	if(!$scope.sectionHeader && $scope.selectedMenu.ancestorIds.length > 0) {
        		if($scope.selectedMenu.ancestorIds.length===1){
        			var rootMenu = $rootScope.menuCategoryMap[$scope.selectedMenu.ancestorIds[0]];
            		$scope.sectionHeader = BY.config.sectionHeader[rootMenu.displayMenuName.toLowerCase().trim()];
        		} else if ($scope.selectedMenu.ancestorIds.length===2){
        			var rootMenu = $rootScope.menuCategoryMap[$scope.selectedMenu.ancestorIds[1]];
            		$scope.sectionHeader = BY.config.sectionHeader[rootMenu.displayMenuName.toLowerCase().trim()];
        		}
        		
        		if($scope.sectionHeader[menuName]){
        			$scope.sectionHeader = $scope.sectionHeader[menuName];
        		}
        	} 
        	//console.log($scope.sectionHeader);
        };
        
        if($scope.selectedMenu){
        	//console.log($scope.selectedMenu.displayMenuName);
            $(".selected-dropdown").removeClass("selected-dropdown");
            $("#" + $scope.selectedMenu.id).parents(".by-menu").addClass("selected-dropdown");
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
            
            $scope.updateSectionHeader();
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

        angular.element($window).bind("scroll", function() {
        	$scope.sliderHeight = $(".by_section_header").height();
        	if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= $scope.sliderHeight){
        		$(".by_left_panel_homeSlider_position").removeClass('by_left_panel_homeSlider');
        		$(".by_left_panel_homeSlider_position").css('margin-top', -$scope.sliderHeight+'px');
        	}else{
        		$(".by_left_panel_homeSlider_position").addClass('by_left_panel_homeSlider');
        		$(".by_left_panel_homeSlider_position").css('margin-top', '0px');
        	}
        });
        
        $scope.resize = function(height, width){
        	if(width > 730){
        		$(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImage +')');
        	} else{
        		$(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImageMobile +')');
        	}   	
        };
 	}]);





//byControllers.controller('DiscussSubCategoryController', ['$scope', '$route', '$rootScope', '$location', '$routeParams', 'DiscussPage',
//    'DiscussCount','$sce',
//    function ($scope, $route, $rootScope, $location, $routeParams, DiscussPage, DiscussCount, $sce) {
//	    var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);
//
//        //$('#discuss').dropdown("toggle");
//		$scope.preSelected = {};
//
//        $scope.discussionViews = {};
//        $scope.discussionViews.leftPanel = "app/components/discuss/discussLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
//        $scope.discussionViews.contentPanel = "app/components/discuss/discussContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
//        $scope.editor = {};
//        $scope.editor.articlePhotoFilename = "";
//        $scope.error = "";
//        $scope.editor.subject = "";
//        var discussType = $routeParams.discussType,
//            topicId = $routeParams.topicId,
//            subTopicId = $routeParams.subTopicId, topicQueryId, subTopicQueryId, topicCategory, subTopicCategory;
//
//
//        if($rootScope.discussCategoryNameIdMap){
//            topicQueryId = $rootScope.discussCategoryNameIdMap[topicId.toLowerCase()];
//            subTopicQueryId = $rootScope.discussCategoryNameIdMap[subTopicId.toLowerCase()];
//
//            topicCategory = $rootScope.discussCategoryListMap[topicQueryId];
//            subTopicCategory = $rootScope.discussCategoryNameIdMap[subTopicId.toLowerCase()];
//        }
//
//        if(topicCategory && topicCategory.childCount <= 0){
//            $scope.preSelected[topicQueryId] = true;
//            BY.editorCategoryList.addCategory(topicQueryId);
//        }
//
//        if(subTopicCategory){
//        	$scope.preSelected[subTopicCategory] = true;
//            BY.editorCategoryList.addCategory(subTopicCategory);
//        }
//
//
//
//
//        if (discussType == '' || discussType == 'undefined' || !discussType || discussType == null) {
//            discussType = 'All';
//        }
//
//
//        $rootScope.bc_topic = topicId;
//        $rootScope.bc_subTopic = subTopicId;
//        $rootScope.bc_discussType = discussType === '' ? 'A' : discussType;
//
//        var params = {};
//        if(topicQueryId !=null && topicQueryId != "" && topicQueryId.toLowerCase() != "all"){
//        	params.topicId = topicQueryId;
//        }
//        if(subTopicQueryId !=null && subTopicQueryId != "" && subTopicQueryId.toLowerCase() != "all"){
//        	params.subTopicId = subTopicQueryId;
//        }
//
//        DiscussCount.get(params, function (counts) {
//                $scope.discuss_counts = counts.data;
//            },
//            function (error) {
//                console.log(error);
//            });
//
//
//        $("#preloader").show();
//        params.p = 0;
//        params.s = 0;
//        if(discussType !=null && discussType != "" && discussType.toLowerCase() != "all"){
//        	params.discussType = discussType;
//        }
//
//        DiscussPage.get(params,
//            function (value) {
//                $scope.discuss = value.data.content;
//                $scope.pageInfo = BY.byUtil.getPageInfo(value.data);
//                $scope.pageInfo.isQueryInProgress = false;
//                $("#preloader").hide();
//            },
//            function (error) {
//                console.log(error);
//            });
//
//
//        $scope.loadMore = function($event){
//        	if($scope.pageInfo && !$scope.pageInfo.lastPage && !$scope.pageInfo.isQueryInProgress ){
//        		$scope.pageInfo.isQueryInProgress = true;
//        		var params = {p:$scope.pageInfo.number + 1,s:$scope.pageInfo.size};
//        		if(discussType !=null && discussType != "" && discussType.toLowerCase() != "all"){
//                	params.discussType = discussType;
//                }
//                if(topicQueryId !=null && topicQueryId != "" && topicQueryId.toLowerCase() != "all"){
//                	params.topicId = topicQueryId;
//                }
//                if(subTopicQueryId !=null && subTopicQueryId != "" && subTopicQueryId.toLowerCase() != "all"){
//                	params.subTopicId = subTopicQueryId;
//                }
//            	DiscussPage.get(params,
//                		function(value){
//            				if(value.data.content.length > 0){
//            					$scope.pageInfo.isQueryInProgress = false;
//            					$scope.discuss = $scope.discuss.concat(value.data.content);
//            				}
//        			       	 $scope.pageInfo = BY.byUtil.getPageInfo(value.data);
//        			       	$scope.pageInfo.isQueryInProgress = false;
//                		},
//                		function(error){
//        			       	console.log("DiscussAllForDiscussType");
//                		});
//        	}
//        }
//
//
//        $scope.add = function (type) {
//            //BY.removeEditor();
//            $scope.error = "";
//            $scope.discussionViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
//            window.scrollTo(0, 0);
//        };
//
//        $scope.postSuccess = function () {
//            $route.reload();
//        };
//
//
//        $scope.go = function($event, type, id, discussType){
//            $event.stopPropagation();
//            if(type === "id"){
//                $location.path('/discuss/'+id);
//            } else if(type === "name" && $rootScope.discussCategoryListMap){
//                var parentCategoryId = $rootScope.discussCategoryListMap[id].parentId,
//                parentCategoryName = parentCategoryId ? $rootScope.discussCategoryListMap[parentCategoryId].name : null;
//
//                if(parentCategoryName){
//                    $location.path('/discuss/All/'+ parentCategoryName + '/' + $rootScope.discussCategoryListMap[id].name);
//                }else{
//                    $location.path('/discuss/All/'+ $rootScope.discussCategoryListMap[id].name + '/all');
//                }
//            }else if(type === "accordian"){
//                $($event.target).find('a').click();
//            }else if(type === "comment") {
//                $location.path('/discuss/' + id).search({comment: true});
//            }
//        }
//
//
//        $scope.trustForcefully = function(html) {
//            return $sce.trustAsHtml(html);
//        };
//
//        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
//            $('p').each(function() {
//                var $this = $(this);
//                if($this.html().replace(/\s|&nbsp;/g, '').length == 0)
//                    $this.remove(); });
//            $('.by_story').dotdotdot();
//        });
//
//
//    }]);

