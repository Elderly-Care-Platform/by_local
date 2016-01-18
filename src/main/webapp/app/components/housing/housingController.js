define(['byApp', 'byUtil', 'userTypeConfig', 'byEditor'], function(byApp, byUtil, userTypeConfig, byEditor) {
    function HousingController($scope, $rootScope, $location, $route, $routeParams,  $sce, $http, FindHousing){
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
        var queryParams                     = {p:0,s:20,sort:"lastModifiedAt"};
        var init                            = initialize();
        $scope.showContact                  = {};
        $scope.showContact.showContactNumber = false;

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
            var seoKeywords = [$scope.selectedMenu.displayMenuName, 'old age home'];
            for(var i=0; i<=$scope.selectedMenu.ancestorIds.length-1;i++){
                var categoryName = $rootScope.menuCategoryMap[$scope.selectedMenu.ancestorIds[i]].displayMenuName;
                seoKeywords.push(categoryName);
            }
            var metaTagParams = {
                title: $scope.selectedMenu.displayMenuName,
                imageUrl: "",
                description: "<p>"+"Find any service for seniors or senior living facilities"+"</p>",
                keywords: seoKeywords
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        }

        function initialize(){
            if($scope.selectedMenu){
                updateMetaTags();
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

       /* $scope.location = function ($event, userID, id) {
            $event.stopPropagation();
            if(id) {
                //profilePageLocation = '/housingProfile/:profileType/:profileId/:userName/:housingFacilityId';
                $location.path('/housingProfile/3/'+userID+'/'+id);
            }
        };*/

       
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
                $location.path("/"+$scope.removeSpecialChars(menu.displayMenuName)+"/"+menu.id+"/"+response.name);
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
        
        $scope.location = function($event, profile, urlQueryParams){
            $event.stopPropagation();
            var url = getProfileDetailUrlS(profile, urlQueryParams, true);
            $location.path(url);
        };
        
        $scope.getHrefProfile = function(profile, urlQueryParams){
        	var newHref = getProfileDetailUrlS(profile, urlQueryParams, false);
            newHref = "#!" + newHref;
            return newHref;
        };
        
        function getProfileDetailUrlS(profile, urlQueryParams, isAngularLocation){
        	var proTitle = "others";
        	 if(profile && profile.name && profile.name.length > 0){
        		 proTitle = profile.name;
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

    HousingController.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams',
        '$sce', '$http','FindHousing'];
    byApp.registerController('HousingController', HousingController);
    return HousingController;
});