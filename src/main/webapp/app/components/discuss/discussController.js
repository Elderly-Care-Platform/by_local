define(['byApp',
    'discussLikeController',
    'shareController',
    'byEditor', 'menuConfig', 'blogMasonary', 'jqueryMasonaryGrid'], function (byApp, discussLikeController, shareController, byEditor, menuConfig, blogMasonary, jqueryMasonaryGrid) {

    'use strict';

    function DiscussAllController($scope, $rootScope, $location ,$route, $routeParams,DiscussPage,
                                  DiscussCount,$sce, $timeout, $window, broadCastMenuDetail) {

        $scope.discussionViews              = {};
        $scope.discussionViews.leftPanel    = "app/components/discuss/discussLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.discussionViews.contentPanel = "app/components/discuss/discussContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";

        $rootScope.byTopMenuId              = $rootScope.mainMenu[0].id ;
        $scope.discussType                  = $routeParams.discussType; //Needed for left side Q/A/P filters
        $scope.showEditor                   = $routeParams.showEditor==='true' ? true : false;
        $scope.showEditorType               = $routeParams.showEditorType ? $routeParams.showEditorType : null;
        $scope.selectedMenu                 = $scope.$parent.menuLevel2;
        $scope.pageSize                     = 20;
        $scope.isGridInitialized            = false;
        $scope.initDiscussListing           = initDiscussListing;
        $scope.initScroll                   = initScroll;
        var tags                            = [];
        var queryParams                     = {p: 0, s: $scope.pageSize, sort: "lastModifiedAt"};
        var init                            = initialize();


        function initialize(){
            if(!$scope.showEditor){
                initDiscussListing();
            }else{
                initScroll();
            }
        }

        function initScroll(){
            if($scope.showEditor){
                $timeout(
                    function () {
                        var tag = $("#discussListContainer");
                        if (tag.length > 0) {
                            $('html,body').animate({scrollTop: tag.offset().top - $(".by_header").height() - 60}, '2000');
                        }
                    }, 100);
            }else if($scope.discussList && $scope.discussList.length > 0 && $scope.$parent.isLeafMenuSelected ){
                $timeout(
                    function () {
                        var tag = $("#discussListContainer");
                        if (tag.length > 0) {
                            $('html,body').animate({scrollTop: tag.offset().top - $(".by_header").height() - 60}, '2000');
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
                            console.log("DiscussAllForDiscussType");
                            $("#preloader").hide();
                            alert("error");
                        });
                }

                $scope.getDiscussData(0, $scope.pageSize);

            };
        }

        $scope.fixedMenuInitialized = function(){
            broadCastMenuDetail.setMenuId($scope.selectedMenu);
        };

        $scope.showEditorPage = function(type){
            $location.search('showEditor', 'true');
            $location.search('showEditorType', type);
            BY.byEditor.removeEditor();
            $location.path("/discuss/list/"+$scope.selectedMenu.slug+"/"+$scope.selectedMenu.id+"/all");
        }

        //$scope.add = function (type) {
        //    require(['editorController'], function(editorController){
        //        BY.byEditor.removeEditor();
        //        $scope.discussionViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        //        window.scrollTo(0, 0);
        //        $scope.$apply();
        //    });
        //
        //};

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



        



        
    }


    DiscussAllController.$inject = ['$scope', '$rootScope', '$location','$route', '$routeParams',
        'DiscussPage', 'DiscussCount','$sce','$timeout', '$window','broadCastMenuDetail'];
    byApp.registerController('DiscussAllController', DiscussAllController);
    return DiscussAllController;

});
