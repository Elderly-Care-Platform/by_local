define(['byApp', 'byUtil', 'userTypeConfig'], function(byApp, byUtil, userTypeConfig) {
    function HousingController($scope, $rootScope, $location, $route, $routeParams,  $sce, broadCastMenuDetail, $http, FindHousing){
        var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);

        $scope.housingViews = {};
        $scope.housingViews.leftPanel = "app/components/housing/housingLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.housingViews.contentPanel = "app/components/housing/housingContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";

        $rootScope.byTopMenuId = $rootScope.mainMenu[1].id ;
        $scope.telNo = BY.config.constants.byContactNumber;
        $scope.selectedMenu = $rootScope.menuCategoryMap[$routeParams.menuId];
        $scope.showFeaturedTag = true;

        var city = $routeParams.city;
        var tags = [];
        var queryParams = {p:0,s:10,sort:"lastModifiedAt"};

        if($scope.selectedMenu){
            (function(){
                var metaTagParams = {
                    title:  $scope.selectedMenu.displayMenuName,
                    imageUrl:   "",
                    description:   "",
                    keywords:[$scope.selectedMenu.displayMenuName,$scope.selectedMenu.slug]
                }
                BY.byUtil.updateMetaTags(metaTagParams);
            })();
            $(".selected-dropdown").removeClass("selected-dropdown");
            $("#" + $scope.selectedMenu.id).parents(".by-menu").addClass("selected-dropdown");

            tags = $.map($scope.selectedMenu.tags, function(value, key){
                return value.id;
            })
            queryParams.tags = tags.toString();  //to create comma separated tags list
        }

        if (city && city !== "" && city !== "all") {
            queryParams.city = city;
        }

        $scope.getData = function () {
            $("#preloader").show();
            FindHousing.get(queryParams, function (housing) {
                    if (housing) {
                        $scope.housing = housing.data.content;
                        $scope.pageInfo = BY.byUtil.getPageInfo(housing.data);
                        $scope.pageInfo.isQueryInProgress = false;
                        $("#preloader").hide();
                    }
                },
                function (error) {
                    console.log(error);
                });
        };
        
        $scope.tooltipText = function(){        	
        	$('[data-toggle="tooltip"]').tooltip(); 
        }
        

        $scope.fixedMenuInitialized = function(){
            broadCastMenuDetail.setMenuId($scope.selectedMenu);
        };
        
        


        //$scope.showBreadcrums();
        $scope.getData(queryParams);
        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.location = function ($event, userID, id) {
            $event.stopPropagation();
            if(id) {
                //profilePageLocation = '/housingProfile/:profileType/:profileId/:userName/:housingFacilityId';
                $location.path('/housingProfile/3/'+userID+'/'+id);
            }
        };

        $scope.add = function (type) {
            require(['editorController'], function(editorController){
                BY.byEditor.removeEditor();
                $scope.error = "";
                $scope.housingViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
                window.scrollTo(0, 0);
                $(".service-filters").hide();
                $scope.$apply();
            });
        };

        $scope.postSuccess = function () {
            $(".service-filters").show();
            $route.reload();
        };

        $scope.cityOptions = {
            types: "(cities)",
            resetOnFocusOut: false
        };

        $scope.addressCallback = function (response) {
            $('#addressCity').blur();
            queryParams.city = response.name;
            $scope.getData(queryParams);
        };

        $scope.loadMore = function ($event) {
            if ($scope.pageInfo && !$scope.pageInfo.lastPage && !$scope.pageInfo.isQueryInProgress) {
                $scope.pageInfo.isQueryInProgress = true;
                queryParams.p = $scope.pageInfo.number + 1;
                queryParams.s = $scope.pageInfo.size;

                FindHousing.get(queryParams, function (housing) {
                        if (housing.data.content.length > 0) {
                            $scope.housing = $scope.housing.concat(housing.data.content);

                        }
                        $scope.pageInfo = BY.byUtil.getPageInfo(housing.data);
                        $scope.pageInfo.isQueryInProgress = false;
                        $("#preloader").hide();
                    },
                    function (error) {
                        console.log(error);
                    });
            }
        };

        $scope.isAllowedToReview = function(housing){
            if(localStorage.getItem("USER_ID") !== housing.userId){
                return true;
            }else{
                return false;
            }
        };
    }

    HousingController.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams',
        '$sce', 'broadCastMenuDetail', '$http','FindHousing'];
    byApp.registerController('HousingController', HousingController);
    return HousingController;
});