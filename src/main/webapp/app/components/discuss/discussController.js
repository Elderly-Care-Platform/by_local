define(['byApp',
    'discussLikeController',
    'shareController',
    'byEditor', 'menuConfig', 'blogMasonary', 'jqueryMasonaryGrid', 'discussService'],
    function (byApp, discussLikeController, shareController, byEditor, menuConfig, blogMasonary, jqueryMasonaryGrid, discussService) {

    'use strict';

    function DiscussAllController($scope, $rootScope, $location ,$route, $routeParams,DiscussPage,
                                  DiscussCount,$sce, $timeout, $window, DisServiceFilter) {

        $scope.discussionViews              = {};
        $scope.discussionViews.leftPanel    = "app/components/discuss/discussLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.discussionViews.contentPanel = "app/components/discuss/discussContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";

        $rootScope.byTopMenuId              = $rootScope.mainMenu[0].id ;
        $scope.discussType                  = $routeParams.discussType; //Needed for left side Q/A/P filters

        $scope.selectedMenu                 = $scope.$parent.menuLevel2;

        $scope.pageSize                     = 20;
        $scope.isGridInitialized            = false;
        $scope.initDiscussListing           = initDiscussListing;
        $scope.initScroll                   = initScroll;
        $scope.showEditorPage               = showEditorPage;
        $scope.shareDiscussObject = {};

        var tags                            = [];
        var queryParams                     = {p: 0, s: $scope.pageSize, sort: "lastModifiedAt"};
        var showEditor                      = $routeParams.showEditor ? $routeParams.showEditor : null; //Needed for left side Q/A/P filters
        var editorType                      = $routeParams.editorType ? $routeParams.editorType : null; //Needed for left side Q/A/P filters
        var init                            = initialize();
        $scope.removeSpecialChars           = BY.byUtil.removeSpecialChars;

        function initialize(){
            initDiscussListing();
            initScroll();
            //if(showEditor){
            //    initScroll();
            //    showEditorPage(null, editorType);
            //}
        }

        $scope.initEditor = function(){
            if(showEditor){
                showEditorPage(null, editorType);
            }
        }

        $scope.openModal = function ($event, data) {
            $event.stopPropagation();
            $scope.shareDiscussObject = data;
            $('#shareModal').modal('show');
        }
        
        function initScroll(){
            if(showEditor){
                $timeout(
                    function () {
                        var tag = $("#discussListContainer");
                        if (tag.length > 0) {
                            $('html,body').animate({scrollTop: tag.offset().top - $(".by_header").height() - 100}, '2000');
                        }
                    }, 100);
            }else if($scope.discussList && $scope.discussList.length > 0 && $scope.$parent.isLeafMenuSelected ){
                $timeout(
                    function () {
                        var tag = $("#discussListContainer");
                        if (tag.length > 0) {
                            $('html,body').animate({scrollTop: tag.offset().top - $(".by_header").height() - 100}, '2000');
                        }
                    }, 100);
            }
        }

        $scope.initGrid = function (index) {
            if ($rootScope.windowWidth > 800) {
                var gridMasonary = $(".masonry");
                window.setTimeout(function(){
                     masonaryGridInit();
                     $(".masonry").masonry("reload");
                    /*if (gridMasonary.length === 0) {
                        masonaryGridInit();
                    } else {
                        $(".masonry").masonry("reload");
                    }*/
                   
                }, 100);

            }
            else if ($rootScope.windowWidth < 800) {
                $(".grid-boxes-in").removeClass('grid-boxes-in');
                //$("#preloader").hide();
            }
            window.scrollTo(0, 0);
            //masonaryGridInit();
        };

        function initDiscussListing() {
            if ($scope.selectedMenu) {
                //Set page title and FB og tags
                (function () {
                    var metaTagParams = {
                        title: $scope.selectedMenu.displayMenuName,
                        imageUrl: "",
                        description: "",
                        keywords: [$scope.selectedMenu.displayMenuName, $scope.selectedMenu.slug]
                    }
                    BY.byUtil.updateMetaTags(metaTagParams);
                })();


                tags = $.map($scope.selectedMenu.tags, function (value, key) {
                    return value.id;
                })

                queryParams.tags = tags.toString();  //to create comma separated tags list
                if ($scope.discussType && $scope.discussType.toLowerCase().trim() !== "all") {
                    queryParams.discussType = $routeParams.discussType;
                }


                DiscussCount.get({tags: tags, contentTypes: "f,total,p,q"}, function (counts) {
                        $scope.discuss_counts = counts.data;
                    },
                    function (error) {
                        console.log(error);
                    });

                if (queryParams.discussType === 'f') {
                    queryParams.isFeatured = true;
                    delete queryParams.discussType;
                }
                $scope.getDiscussData = function (page, size) {
                    $("#preloader").show();
                    queryParams.p = page;
                    queryParams.s = size;
                    DiscussPage.get(queryParams,
                        function (value) {
                            $scope.discussList = value.data.content;
                            $scope.pageInfo = BY.byUtil.getPageInfo(value.data);
                            $scope.pageInfo.isQueryInProgress = false;
                            $scope.discussPagination = {};
                            $scope.discussPagination.totalPosts = value.data.total;
                            $scope.discussPagination.noOfPages = Math.ceil(value.data.total / value.data.size);
                            $scope.discussPagination.currentPage = value.data.number;
                            $scope.discussPagination.pageSize = $scope.pageSize;

                           /* if($scope.discussList.length === 0){
                                $("#preloader").hide();
                            }*/
                            $("#preloader").hide();
                            initScroll();
                        },
                        function (error) {
                            $("#preloader").hide();
                            console.log(error);
                        });
                }

                $scope.getDiscussData(0, $scope.pageSize);

            };
        }


        function showEditorPage(event, type){
            if(event){
                event.stopPropagation();
            }

            $scope.showEditorType = type;
            $(".by_editorButtonWrap_thumb").animate({width: '100%', borderRightWidth: '0px'}, "500");
            $("."+type+"hidePanel").hide();
            $("."+type+"by_editorButtonWrap_thumb").hide();
            $("."+type+"showPanel").slideDown("500");

            if($scope.showEditorType==='Question'){
                var tinyEditor = BY.byEditor.addEditor({"editorTextArea":"question_textArea"});
            }

            if($scope.showEditorType==='Article'){
                var tinyEditor = BY.byEditor.addEditor({
                    "editorTextArea" : "article_textArea",
                    "autoFocus" : "false"
                });

            }
            $("#shareInputFeild").focus();
        }

        $scope.exitEditorDiscuss = function(type, event){
            event.stopPropagation();
            $(".by_editorButtonWrap_thumb").animate({width: '50%', borderRightWidth: '1px'}, "500");
            $("."+type+"hidePanel").show();
            $("."+type+"by_editorButtonWrap_thumb").show();
            $("."+type+"showPanel").slideUp("100", function  () {
                BY.byEditor.removeEditor();
                //$route.reload();
            });

        }

        $scope.postSuccess = function () {
            $route.reload();
        };

        $scope.trustForcefully = function(html) {
            return $sce.trustAsHtml(html);
        };

        $scope.trustAsResourceUrl = function(url) {
            return $sce.trustAsResourceUrl(url);
        };

        $scope.go = function($event, discuss, urlQueryParams){
            $event.stopPropagation();
            var url = DisServiceFilter.getDiscussDetailUrl(discuss, urlQueryParams, true);
            $location.path(url);
        };
        
        $scope.getHref = function(discuss, urlQueryParams){
        	var newHref = DisServiceFilter.getDiscussDetailUrl(discuss, urlQueryParams, false);
            newHref = "#!" + newHref;
            return newHref;
        };

        
        
        $scope.getHrefProfile = function(profile, urlQueryParams){
        	var newHref = getProfileDetailUrl(profile, urlQueryParams, false);
            newHref = "#!" + newHref;
            return newHref;
        };

        function getProfileDetailUrl(profile, urlQueryParams, isAngularLocation){
        	var proTitle = "others";
        	 if(profile && profile.userProfile && profile.userProfile.basicProfileInfo.firstName && profile.userProfile.basicProfileInfo.firstName.length > 0){
        		 proTitle = profile.userProfile.basicProfileInfo.firstName;
        		 if(profile.userProfile.individualInfo.lastName && profile.userProfile.individualInfo.lastName != null && profile.userProfile.individualInfo.lastName.length > 0){
        			 proTitle = proTitle + " " + profile.userProfile.individualInfo.lastName;
        		 }
        	 } else if(profile && profile.username && profile.username.length > 0){
        		 proTitle = BY.byUtil.validateUserName(profile.username);
        	 }else{
        		 proTitle = "others";
        	 }

        	proTitle = BY.byUtil.getSlug(proTitle);
            var newHref = "/users/"+proTitle;


            if(urlQueryParams && Object.keys(urlQueryParams).length > 0){
                //Set query params through angular location search method
                if(isAngularLocation){
                    angular.forEach($location.search(), function (value, key) {
                        $location.search(key, null);
                    });
                    angular.forEach(urlQueryParams, function (value, key) {
                        $location.search(key, value);
                    });
                } else{ //Set query params manually
                    newHref = newHref + "?"

                    angular.forEach(urlQueryParams, function (value, key) {
                        newHref = newHref + key + "=" + value + "&";
                    });

                    //remove the last  '&' symbol from the url, otherwise browser back does not work
                    newHref = newHref.substr(0, newHref.length - 1);
                }
            }

            return newHref;
        };



        



        
    }


    DiscussAllController.$inject = ['$scope', '$rootScope', '$location','$route', '$routeParams',
        'DiscussPage', 'DiscussCount','$sce','$timeout', '$window', 'DisServiceFilter'];

    byApp.registerController('DiscussAllController', DiscussAllController);
    return DiscussAllController;

});
