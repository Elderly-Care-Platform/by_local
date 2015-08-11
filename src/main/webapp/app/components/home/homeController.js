/**
 * Created by sanjukta on 02-07-2015.
 */
//home
byControllers.controller('BYHomeController', ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', 'DiscussPage', '$sce', '$window','FindServices',
    function ($scope, $rootScope, $routeParams, $timeout, $location, DiscussPage, $sce, $window,FindServices) {
		$scope.carousalType = "carousel";
		$('.carousel').carousel({
	        interval: 8000
	    });
	    $('.carousel').carousel('cycle');
        $scope.currentAcceleratorSelected = "";
        var scrollable = false;

        $scope.$watch("posts", function (value) {
            if($scope.currentAcceleratorSelected === 'home_featured_articles'){
                $timeout(
                    function () {
                        $scope.scrollToId($scope.currentAcceleratorSelected)
                    }, 100);
            }

        });

        $scope.$watch("questions", function (value) {
            if($scope.currentAcceleratorSelected === 'home_featured_qa'){
                $timeout(
                    function () {
                        $scope.scrollToId($scope.currentAcceleratorSelected)
                    }, 100);
            }

        });

        $scope.$watch("services", function (value) {
            if($scope.currentAcceleratorSelected === 'home_featured_services'){
                $timeout(
                    function () {
                        $scope.scrollToId($scope.currentAcceleratorSelected)
                    }, 100);
            }

        });

        $scope.homeViews = {};
        $scope.add = function (type) {
            //BY.removeEditor();
            $scope.currentView = "editor";
            $scope.homeViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            window.scrollTo(0, 0);
        }

        $scope.postSuccess = function () {
            $scope.switchToContentView();
        };

        (function(){
            var metaTagParams = {
                title:  "Home",
                imageUrl:   "",
                description:   ""
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        })();


        $scope.switchToContentView = function (scrollTo) {
            $scope.currentAcceleratorSelected = scrollTo || $scope.currentAcceleratorSelected;
            if($scope.currentAcceleratorSelected && $scope.currentAcceleratorSelected!=="" && $scope.contentType !== "all"){
                $scope.contentType = "all";
                $scope.contentSize = 3;
                $scope.currentView = "";
            }
            if ($scope.currentView != "content") {
                $scope.currentView = "content";
                $scope.homeViews.leftPanel = "app/components/home/homeLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
                $scope.homeViews.contentPanel = "app/components/home/homeContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
                if($scope.contentType==="all" || $scope.contentType==="P"){
                    DiscussPage.get({discussType: 'P',isFeatured:true,p:0,s:$scope.contentSize,sort:"lastModifiedAt"},
                        function(value){
                            $scope.posts = value.data.content;
                            $scope.postsPageInfo = BY.byUtil.getPageInfo(value.data);
                            $scope.postsPageInfo.isQueryInProgress = false;
                        },
                        function(error){
                            console.log("DiscussPage");
                        });
                }

                if($scope.contentType==="all" || $scope.contentType==="Q"){
                    DiscussPage.get({discussType: 'Q',isFeatured:true,p:0,s:$scope.contentSize,sort:"lastModifiedAt"},
                        function(value){
                            $scope.questions = value.data.content;
                            $scope.questionsPageInfo = BY.byUtil.getPageInfo(value.data);
                            $scope.questionsPageInfo.isQueryInProgress = false;
                        },
                        function(error){
                            console.log("DiscussPage");
                        });
                }

                if($scope.contentType==="all" || $scope.contentType==="S"){
                    FindServices.get({page:0,size:$scope.contentSize,sort:"lastModifiedAt",isFeatured:true},
                        function(value){
                            $scope.services = value.data.content;
                            $scope.servicesPageInfo = BY.byUtil.getPageInfo(value.data);
                            $scope.servicesPageInfo.isQueryInProgress = false;
                        },
                        function(error){
                            console.log("DiscussPage");
                        });
                }
            } else {
                $scope.scrollToId(scrollTo);
            }
        }

        //$scope.switchToContentView();

        $scope.scrollToId = function (id) {
            $scope.currentAcceleratorSelected = "";
            if (id) {
                var tag = $("#" + id + ":visible");
                if (tag.length > 0) {
                    $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, 'slow');
                }

            } else {
                window.scrollTo(0, 0);
            }
        }
        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        if ($routeParams.type === "P" || $routeParams.type === "Q" || $routeParams.type === "S") {
            $scope.contentType = $routeParams.type;
            $scope.contentSize = 3;
            $scope.switchToContentView();
        } else {
            $scope.contentType = "all";
            $scope.contentSize = 3;
            $scope.currentView = "";
            $scope.switchToContentView();
        }

        $scope.go = function ($event, type, id, discussType) {
            $event.stopPropagation();
            if (type === "id") {
                $location.path('/discuss/' + id);
            } else if (type === "menu") {
                var menu = $rootScope.menuCategoryMap[id];
                if(menu.module===0){
                    $location.path("/discuss/list/"+menu.displayMenuName+"/"+menu.id+"/all/");
                }else if(menu.module===1){
                    $location.path("/services/list/"+menu.displayMenuName+"/"+menu.id+"/all/");
                }else{
                    //nothing as of now
                }
            } else if (type === "accordian") {
                $($event.target).find('a').click();
            } else if(type === "comment") {
                $location.path('/discuss/' + id).search({comment: true});
            }
        }

         angular.element($window).bind("scroll", function() {
            $scope.sliderHeight = $(".homeSlider").height();
            if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= $scope.sliderHeight){
                $(".by_left_panel_homeSlider_position").removeClass('by_left_panel_homeSlider');
                $(".by_left_panel_homeSlider_position").css('margin-top', -$scope.sliderHeight+'px');
            }else{
                $(".by_left_panel_homeSlider_position").addClass('by_left_panel_homeSlider');
                $(".by_left_panel_homeSlider_position").css('margin-top', '0px');
            }
        });
       
        	 
         //for featured services
         $scope.location = function ($event, userId, userType) {
             $event.stopPropagation();
             if (userId && userType.length > 0) {
                 $location.path('/profile/' + userType[0] + '/' + userId);
             }
         };
         //for featured services
         $scope.profileImage = function (service) {
             service.profileImage = BY.config.profile.userType[service.userTypes[0]].profileImage;
         };

        $scope.showMore = function(discussType){
            $location.path($location.$$path).search({type: discussType});
        };


        $scope.loadMore = function($event){
            if($scope.contentType !=="all"){
                if($scope.contentType === "P"){
                    $scope.pageInfo = $scope.postsPageInfo;
                }else if($scope.contentType === "Q"){
                    $scope.pageInfo = $scope.questionsPageInfo;
                }else if($scope.contentType === "S"){
                    $scope.pageInfo = $scope.servicesPageInfo;
                }

                if($scope.pageInfo && !$scope.pageInfo.lastPage && !$scope.pageInfo.isQueryInProgress ){
                    $scope.pageInfo.isQueryInProgress = true;
                    var p = $scope.pageInfo.number + 1,
                    s = $scope.pageInfo.size;

                    if($scope.contentType === "Q"){
                        DiscussPage.get({discussType: $scope.contentType, isFeatured:true, p:p, s:s, sort:"lastModifiedAt"},
                            function(value){
                                if(value.data.content.length > 0){
                                    $scope.questionsPageInfo.isQueryInProgress = false;
                                    $scope.questions = $scope.questions.concat(value.data.content);
                                }
                                $scope.questionsPageInfo = BY.byUtil.getPageInfo(value.data);
                                $scope.questionsPageInfo.isQueryInProgress = false;
                            },
                            function(error){
                                console.log("DiscussPage");
                            });
                    } else if($scope.contentType === "P"){
                        DiscussPage.get({discussType: $scope.contentType, isFeatured:true, p:p, s:s, sort:"lastModifiedAt"},
                            function(value){
                                if(value.data.content.length > 0){
                                    $scope.postsPageInfo.isQueryInProgress = false;
                                    $scope.posts = $scope.posts.concat(value.data.content);
                                }
                                $scope.postsPageInfo = BY.byUtil.getPageInfo(value.data);
                                $scope.postsPageInfo.isQueryInProgress = false;
                            },
                            function(error){
                                console.log("DiscussPage");
                            });
                    } else{
                        FindServices.get({page:p,size:s,sort:"lastModifiedAt",isFeatured:true},
                            function(value){
                                if(value.data.content.length > 0){
                                    $scope.servicesPageInfo.isQueryInProgress = false;
                                    $scope.services = $scope.services.concat(value.data.content);
                                }
                                $scope.servicesPageInfo = BY.byUtil.getPageInfo(value.data);
                                $scope.servicesPageInfo.isQueryInProgress = false;
                            },
                            function(error){
                                console.log("DiscussPage");
                            });
                    }
                }
            }

        };

    }]);

