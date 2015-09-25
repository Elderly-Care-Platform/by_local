define(['byApp',
    'discussLikeController',
    'shareController',
    'editorController',
    'byEditor', 'blogMasonary', 'jqueryMasonaryGrid'],
    function (byApp, discussLikeController, shareController, editorController, byEditor, blogMasonary, jqueryMasonaryGrid) {

    'use strict';

    function DiscussAllController($scope, $rootScope, $location, $route, $routeParams, DiscussPage,
                                  DiscussCount, $sce, $timeout, $window, broadCastMenuDetail) {

        var a = $(".header .navbar-nav > li.dropdown");
        a.removeClass("dropdown");
        setTimeout(function () {
            a.addClass("dropdown")
        }, 200);

        $scope.discussionViews = {};
        $scope.discussionViews.leftPanel = "app/components/discuss/discussLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.discussionViews.contentPanel = "app/components/discuss/discussContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.selectedMenu = $rootScope.menuCategoryMap ? $rootScope.menuCategoryMap[$routeParams.menuId] : null;
        $scope.discussType = $routeParams.discussType; //Needed for left side Q/A/P filters
        $scope.pageSize = 20;

        $scope.isGridInitialized = false;

        var tags = [];
        var queryParams = {p: 0, s: $scope.pageSize, sort: "lastModifiedAt"};

        $scope.initGrid = function (index) {
            console.log(index);
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
                    $("#preloader").hide();
                }, 100);

            }
            else if ($rootScope.windowWidth < 800) {
                $(".grid-boxes-in").removeClass('grid-boxes-in');
                $("#preloader").hide();
            }
            window.scrollTo(0, 0);
            //masonaryGridInit();
        };

        $scope.initDiscussListing = function () {
            if ($scope.selectedMenu) {
                //console.log($scope.selectedMenu.displayMenuName);

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

                            if($scope.discussList.length === 0){
                                $("#preloader").hide();
                            }
                        },
                        function (error) {
                            console.log("DiscussAllForDiscussType");
                            $("#preloader").hide();
                            alert("error");
                        });
                }

                $scope.getDiscussData(0, $scope.pageSize);

            }
            ;
        }


        $scope.fixedMenuInitialized = function () {
            broadCastMenuDetail.setMenuId($scope.selectedMenu);
        };

        /*$scope.loadMore = function($event){
         if($scope.pageInfo && !$scope.pageInfo.lastPage && !$scope.pageInfo.isQueryInProgress ){
         $scope.pageInfo.isQueryInProgress = true;
         queryParams.p = $scope.pageInfo.number + 1;
         queryParams.s = $scope.pageInfo.size;

         if(queryParams.discussType === 'f'){
         queryParams.isFeatured=true;
         delete queryParams[discussType];
         }

         DiscussPage.get(queryParams,
         function(value){

         if(value.data.content.length > 0){
         $scope.pageInfo.isQueryInProgress = false;
         $scope.discussList = $scope.discussList.concat(value.data.content);
         }
         $scope.pageInfo = BY.byUtil.getPageInfo(value.data);
         $scope.pageInfo.isQueryInProgress = false;
         if($rootScope.windowWidth>800){
         setTimeout(function(){$(".masonry").masonry("reload")},10);
         }
         if($rootScope.windowWidth<800){
         $(".grid-boxes-in").removeClass('grid-boxes-in');
         }
         },
         function(error){
         console.log("DiscussAllForDiscussType");
         });
         }
         }*/

        $scope.add = function (type) {
            $scope.discussionViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            window.scrollTo(0, 0);
        };

        $scope.postSuccess = function () {
            $route.reload();
        };

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.trustAsResourceUrl = function (url) {
            return $sce.trustAsResourceUrl(url);
        };

        $scope.go = function ($event, type, id, discussType) {
            $event.stopPropagation();
            if (type === "detail") {
                $location.path('/discuss/' + id);
            } else if (type === "menu" && $rootScope.menuCategoryMap) {
                var menu = $rootScope.menuCategoryMap[id];
                //$(".selected-dropdown").removeClass("selected-dropdown");
                //$("#" + menu.id).parents(".dropdown").addClass("selected-dropdown");
                if (menu.module === 0) {
                    $location.path("/discuss/list/" + menu.displayMenuName + "/" + menu.id + "/all");
                } else if (menu.module === 1) {
                    $location.path("/services/list/" + menu.displayMenuName + "/" + menu.id + "/all/");
                } else {
                    //nothing as of now
                }
            } else if (type === "accordian") {
                $($event.target).find('a').click();
            } else if (type === "comment") {
                $location.path('/discuss/' + id).search({comment: true});
            }
        }

    }


    DiscussAllController.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams',
        'DiscussPage', 'DiscussCount', '$sce', '$timeout', '$window', 'broadCastMenuDetail'];
    byApp.registerController('DiscussAllController', DiscussAllController);
    return DiscussAllController;

});
