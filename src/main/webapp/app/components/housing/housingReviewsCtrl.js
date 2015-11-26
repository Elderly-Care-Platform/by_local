define(['byApp',
    'discussLikeController',
    'shareController',
    'byEditor', 'menuConfig', 'blogMasonary', 'jqueryMasonaryGrid'], function (byApp, discussLikeController, shareController, byEditor, menuConfig, blogMasonary, jqueryMasonaryGrid) {

    'use strict';

    function HousingReviewsCtrl($scope, $rootScope, $location, $route, $routeParams, DiscussPage,
                                 DiscussCount, $sce, $timeout) {

        window.scrollTo(0, 0);
        $scope.discussType = $routeParams.discussType; //Needed for left side Q/A/P filters
        $scope.selectedMenu = $scope.$parent.selectedMenu;
        $scope.pageSize = 20;
        $scope.isGridInitialized = false;

        var tags = [];
        var queryParams = {p: 0, s: $scope.pageSize, sort: "lastModifiedAt"};

        $scope.initGrid = function (index) {
            if ($rootScope.windowWidth > 800) {
                var gridMasonary = $(".masonry");
                window.setTimeout(function () {
                    masonaryGridInit();
                    $(".masonry").masonry("reload");
                }, 100);

            }
            else if ($rootScope.windowWidth < 800) {
                $(".grid-boxes-in").removeClass('grid-boxes-in');
                $("#preloader").hide();
            }
            window.scrollTo(0, 0);
            //masonaryGridInit();
        };

        function updateMetaTags(){
            var metaTagParams = {
                title: $scope.selectedMenu.displayMenuName,
                imageUrl: "",
                description: "",
                keywords: [$scope.selectedMenu.displayMenuName, $scope.selectedMenu.slug]
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        }

        $scope.initDiscussListing = function () {
            if ($scope.selectedMenu) {
                updateMetaTags();
                //tags = $.map($scope.selectedMenu.tags, function (value, key) {
                //    return value.id;
                //})
                //queryParams.tags = tags.toString();  //to create comma separated tags list

                queryParams.tags = BY.config.menu.reveiwsMenuConfig['housing_review'].tag;
                if ($scope.discussType && $scope.discussType.toLowerCase().trim() !== "all") {
                    queryParams.discussType = $routeParams.discussType;
                }

                DiscussCount.get({tags: queryParams.tags, contentTypes: "f,total,p,q"}, function (counts) {
                        $scope.discuss_counts = counts.data;
                    },
                    function (error) {
                        console.log(error);
                    }
                );

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

                            /*if ($scope.discussList.length === 0) {
                                $("#preloader").hide();
                            }*/

                            $("#preloader").hide();
                        },
                        function (error) {
                            $("#preloader").hide();
                            console.log(error);
                        });
                }

                $scope.getDiscussData(0, $scope.pageSize);

            };
        }


        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.trustAsResourceUrl = function (url) {
            return $sce.trustAsResourceUrl(url);
        };

        $scope.nextLocation = function(discussId){
            $location.path("/discuss/"+ discussId);
        }
    }


    HousingReviewsCtrl.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams',
        'DiscussPage', 'DiscussCount', '$sce', '$timeout'];

    byApp.registerController('HousingReviewsCtrl', HousingReviewsCtrl);
    return HousingReviewsCtrl;

});
