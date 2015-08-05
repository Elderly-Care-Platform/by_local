/**
 * Created by sanjukta on 02-07-2015.
 */
//home
byControllers.controller('BYHomeController', ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', 'DiscussPage', '$sce', '$window',
    function ($scope, $rootScope, $routeParams, $timeout, $location, DiscussPage, $sce, $window) {
		$scope.carousalType = "carousel";
		$('.carousel').carousel({
	        interval: 6000
	    });
	    $('.carousel').carousel('cycle');
        $scope.currentAcceleratorSelected = "";
        var scrollable = false;
        
        $scope.$watch("articles", function (value) {
            $timeout(
                function () {
                    $scope.scrollToId($scope.currentAcceleratorSelected)
                }, 100);
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
            if ($scope.currentView != "content") {
                $scope.currentView = "content";
                $scope.homeViews.leftPanel = "app/components/home/homeLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
                $scope.homeViews.contentPanel = "app/components/home/homeContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
                DiscussPage.get({discussType: 'A',isFeatured:true,p:0,s:3,sort:"lastModifiedAt"},
                		function(value){
                				$scope.articles = value.data.content;
                		},
                		function(error){
        			       	console.log("DiscussPage");
//        			       	alert("error");
                		});
                DiscussPage.get({discussType: 'P',isFeatured:true,p:0,s:3,sort:"lastModifiedAt"},
                		function(value){
                				$scope.posts = value.data.content;
                		},
                		function(error){
        			       	console.log("DiscussPage");
//        			       	alert("error");
                		});
                DiscussPage.get({discussType: 'Q',isFeatured:true,p:0,s:3,sort:"lastModifiedAt"},
                		function(value){
                				$scope.questions = value.data.content;
                		},
                		function(error){
        			       	console.log("DiscussPage");
//        			       	alert("error");
                		});

             
            } else {
                $scope.scrollToId(scrollTo);
            }
        }

        //$scope.switchToContentView();

        $scope.scrollToId = function (id) {
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

        if ($routeParams.type === "aboutUs") {
            $scope.currentView = "aboutUs";
            //$scope.homeViews.contentPanel = "'app/components/aboutUs/aboutUs.html?nitin=jain'";
            //$scope.homeViews.leftPanel = "'app/components/aboutUs/aboutUsContentPanel.html?nitin=jain'";
        } else {
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
                    $location.path("/discuss/list/"+menu.displayMenuName+"/all/"+menu.id);
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

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

            $('p').each(function () {
                var $this = $(this);
                if ($this.html().replace(/\s|&nbsp;/g, '').length == 0)
                    $this.remove();
            });

            $('.by_story').dotdotdot();
        });
        
        //var addScroll = function(){
        //	scrollable = true;
        //
        ////}

        angular.element($window).bind("scroll", function() {
            $scope.sliderHeight = $(".homeSlider").height();
            if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= $scope.sliderHeight){
                $(".by_left_panel_homeSlider_position").removeClass('by_left_panel_homeSlider');
                $(".by_left_panel_homeSlider_position").css('margin-top', -$scope.sliderHeight+'px');
            }else{
                $(".by_left_panel_homeSlider_position").addClass('by_left_panel_homeSlider');
                $(".by_left_panel_homeSlider_position").css('margin-top', '0px');
            }
        })
        
       

    }]);

