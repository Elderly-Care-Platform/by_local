//DIscuss All
byControllers.controller('HousingController', ['$scope', '$rootScope', '$location', '$route', '$routeParams',  '$sce', '$window','broadCastMenuDetail', '$http',
    function ($scope, $rootScope, $location, $route, $routeParams,  $sce, $window, broadCastMenuDetail, $http) {

        var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);

        $scope.housingViews = {};
        $scope.housingViews.leftPanel = "app/components/housing/housingLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.housingViews.contentPanel = "app/components/housing/housingContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";

        $scope.showSpecialityFilter = false;
        $scope.selectedMenu = $rootScope.menuCategoryMap[$routeParams.menuId];
        $scope.showFeaturedTag = true;

        var city = $routeParams.city;
        var tags = [];
        var queryParams = {p:0,s:10};
        
        
    

        if($scope.selectedMenu){
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
            $http.get("api/v1/housing/page")
            .success(function (housing) {
                if (housing) {
                    $scope.housing = housing.data.content;
                    $scope.pageInfo = BY.byUtil.getPageInfo(housing.data);
                    $scope.pageInfo.isQueryInProgress = false;
                    $("#preloader").hide();
                }
            }).error(function(error){
                console.log(error);
            });

        };

        $scope.fixedMenuInitialized = function(){
            broadCastMenuDetail.setMenuId($scope.selectedMenu);
        };


        $scope.showFilters = function () {
            if ($scope.selectedMenu && $scope.selectedMenu.filterName && $scope.selectedMenu.filterName!==null && $scope.selectedMenu.children.length > 0) {
                $scope.showSpecialityFilter = true;
                $scope.specialities = $.map($scope.selectedMenu.children, function (value, key) {
                    return {label:value.displayMenuName, value:value.displayMenuName, obj:value};
                });
            }
        }

        //$scope.showBreadcrums();
        $scope.showFilters();
        $scope.getData(queryParams);

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        }


        $scope.location = function ($event, userId, userType) {
            $event.stopPropagation();
            if (userId) {
                $location.path('/profile/3' + '/' + userId);
            }
        }

        $scope.add = function (type) {
            $scope.error = "";
            $scope.housingViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            window.scrollTo(0, 0);
            $(".service-filters").hide();
        };

        $scope.postSuccess = function () {
            $(".service-filters").show();
            $route.reload();
        };

        $scope.cityOptions = {
            types: "(cities)",
            resetOnFocusOut: false
        }

        $scope.addressCallback = function (response) {
            $('#addressCity').blur();
            queryParams.city = response.name;
            $scope.getData(queryParams);
        }

       


        $scope.loadMore = function ($event) {
            if ($scope.pageInfo && !$scope.pageInfo.lastPage && !$scope.pageInfo.isQueryInProgress) {
                $scope.pageInfo.isQueryInProgress = true;
                queryParams.page = $scope.pageInfo.number + 1;
                queryParams.size = $scope.pageInfo.size;
                
                $http.get("api/v1/housing/page"+queryParams)
                .success(function (housing) {
                    if (housing) {
                    	if (services.data.content.length > 0) {
                            $scope.pageInfo.isQueryInProgress = false;
                            $scope.housing = $scope.housing.concat(housing.data.content);
                        }
                        $scope.pageInfo = BY.byUtil.getPageInfo(housing.data);
                        $scope.pageInfo.isQueryInProgress = false;
                        $("#preloader").hide();
                    }
                }).error( function (error) {
                    console.log("Services on city not found");
                });


            }
        }
        
       
        

        $scope.isAllowedToReview = function(housing){
            if(localStorage.getItem("USER_ID") !== housing.userId){
                return true;
            }else{
                return false;
            }
        }
    }]);
