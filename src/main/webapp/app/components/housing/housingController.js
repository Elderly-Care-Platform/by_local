define(['byApp', 'byUtil', 'userTypeConfig'], function(byApp, byUtil, userTypeConfig) {
    function HousingController($scope, $rootScope, $location, $route, $routeParams,  $sce, broadCastMenuDetail, $http, FindHousing){
        $scope.housingViews                 = {};
        $scope.housingViews.leftPanel       = "app/components/housing/housingLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.housingViews.contentPanel    = "app/components/housing/housingContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";

        $rootScope.byTopMenuId              = $rootScope.mainMenu[1].id ;
        $scope.telNo                        = BY.config.constants.byContactNumber;
        $scope.selectedMenu                 = $rootScope.menuCategoryMap[$routeParams.menuId];
        $scope.showEditor                   = $routeParams.showEditor==='true' ? true : false;
        $scope.showFeaturedTag              = true;
        $scope.menuConfig                   = BY.config.menu;
        $scope.getData                      = $scope.getData;

        var city                            = $routeParams.city;
        var tags                            = [];
        var queryParams                     = {p:0,s:10,sort:"lastModifiedAt"};
        var init                            = initialize();

        function getData() {
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
                    $("#preloader").hide();
                    console.log(error);
                });
        };

        function updateMetaTags(){
            var metaTagParams = {
                title:  $scope.selectedMenu.displayMenuName,
                imageUrl:   "",
                description:   "",
                keywords:[$scope.selectedMenu.displayMenuName,$scope.selectedMenu.slug]
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        }

        function initialize(){
            if($scope.selectedMenu){
                tags = $.map($scope.selectedMenu.tags, function(value, key){
                    return value.id;
                })
                queryParams.tags = tags.toString();  //to create comma separated tags list
            }

            if (city && city !== "" && city !== "all") {
                queryParams.city = city;
            }

            if(!$scope.showEditor && $scope.selectedMenu.module===BY.config.menu.modules['housing'].moduleId){
                getData(queryParams);
            }
        }


        $scope.tooltipText = function(){        	
        	$('[data-toggle="tooltip"]').tooltip(); 
        }
        

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };
        
        $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;

        $scope.location = function ($event, userID, id) {
            $event.stopPropagation();
            if(id) {
                //profilePageLocation = '/housingProfile/:profileType/:profileId/:userName/:housingFacilityId';
                $location.path('/housingProfile/3/'+userID+'/'+id);
            }
        };

       
        $scope.cityOptions = {
            types: "(cities)",
            resetOnFocusOut: false
        };

        $scope.addressCallback = function (response) {
            var menu = $scope.selectedMenu;
                $location.search('showEditor', null);
                $location.search('showEditorType', null);
                $location.search('postCategoryTag', null);
                if(menu.module == $scope.menuConfig.modules['discuss'].moduleId){
                    menu = $rootScope.menuCategoryMap['55bcadaee4b08970a736784c'];
                }
                $location.path("/senior-living/"+$scope.removeSpecialChars(menu.displayMenuName)+"/"+menu.id+"/"+response.name);
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
                        $("#preloader").hide();
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