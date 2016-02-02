//DIscuss All
define(['byApp', 'byUtil', 'userTypeConfig', 'byEditor'],
    function (byApp, byUtil, userTypeConfig, byEditor) {

        function ServicesController($scope, $rootScope, $location, $route, $routeParams, FindServices, $sce) {
            $scope.findViews                = {};
            $scope.findViews.leftPanel      = "app/components/find/servicesLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            $scope.findViews.contentPanel   = "app/components/find/servicesContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            $scope.telNo                    = BY.config.constants.byContactNumber;
            $scope.showSpecialityFilter     = false;
            $scope.selectedMenu             = $rootScope.menuCategoryMap[$routeParams.menuId];
            $scope.showEditor               = $routeParams.showEditor==='true' ? true : false;
            $scope.showFeaturedTag          = true;
            $scope.menuConfig               = BY.config.menu;
            $rootScope.byTopMenuId          = $rootScope.mainMenu[1].id ;
            $scope.showFilters              = showFilters;
            $scope.getData                  = $scope.getData;
            $scope.selectedMenuId           = $routeParams.menuId;
            $scope.userTypeConfig           = BY.config.profile.userTypeMap;
            $scope.showContact              = {};
            $scope.showContact.showContactNumber = false;
            $scope.pageIdx                  = $routeParams.pageIdx ? $routeParams.pageIdx : 0;

            var city                        = $routeParams.city ? $routeParams.city : 'all',
                tags                        = [],
                queryParams                 = {page: $scope.pageIdx, size: 20};

            var init                        = initialize();

            function showFilters() {
                if ($scope.selectedMenu && $scope.selectedMenu.filterName && $scope.selectedMenu.filterName !== null && $scope.selectedMenu.children.length > 0) {
                    $scope.showSpecialityFilter = true;
                    $scope.specialities = $.map($scope.selectedMenu.children, function (value, key) {
                        return {label: value.displayMenuName, value: value.displayMenuName, obj: value};
                    });
                }
            };

            function getData(queryParams) {
                $("#preloader").show();
                $scope.services = FindServices.get(queryParams, function (services) {
                        $scope.services = services.data.content;
                        $scope.pageInfo = BY.byUtil.getPageInfo(services.data);
                        $scope.pageInfo.isQueryInProgress = false;
                        $("#preloader").hide();

                        /* adding seo pagination url */
                        var urlQueryParams = $location.search(),
                            currentPageIdx = services.data.number,
                            lastPageIdx = Math.ceil(services.data.total / services.data.size) - 1;
                        BY.byUtil.paginationSeoUrl(urlQueryParams, currentPageIdx, lastPageIdx);
                        /* end seo pagination url */
                        },
                        function(error) {
                        $("#preloader").hide();
                        console.log(error);
                    });

            };

            function initialize(){
                if ($scope.selectedMenu) {
                    updateMetaTags();
                    tags = $.map($scope.selectedMenu.tags, function (value, key) {
                        return value.id;
                    })
                    queryParams.tags = tags.toString();  //to create comma separated tags list

                }

                if (city && city !== "" && city !== "all") {
                    queryParams.city = city;
                }

                if(!$scope.showEditor && $scope.selectedMenu.module===BY.config.menu.modules['service'].moduleId){
                    showFilters();
                    getData(queryParams);
                }

            }

            function updateMetaTags(){
                var seoKeywords = [$scope.selectedMenu.displayMenuName, 'senior care services', 'elder care services'];
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

            $scope.profileImage = function (service) {
                service.profileImage = BY.config.profile.userType[service.userTypes[0]].profileImage;
            }

            $scope.trustForcefully = function (html) {
                return $sce.trustAsHtml(html);
            }

            $scope.cityOptions = {
                types: "(cities)",
                resetOnFocusOut: false
            }
            $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;
             
            $scope.addressCallback = function (response) {
                var menu = $scope.selectedMenu;
                $location.search('showEditor', null);
                $location.search('showEditorType', null);
                $location.search('postCategoryTag', null);
                if(menu.module == $scope.menuConfig.modules['discuss'].moduleId){
                    menu = $rootScope.menuCategoryMap['56406cd03e60f5b66f62df26'];
                }
                $location.path("/"+$scope.removeSpecialChars(menu.displayMenuName)+"/"+menu.id+"/"+response.name);
            }

            $scope.specialityCallback = function (speciality) {
                tags = speciality.obj.tags[0].id;
                queryParams.tags = tags.toString();
                getData(queryParams);
            }
            
            $scope.tooltipText = function(){        	
            	$('[data-toggle="tooltip"]').tooltip(); 
            }


            $scope.loadMore = function ($event) {
                if ($scope.pageInfo && !$scope.pageInfo.lastPage && !$scope.pageInfo.isQueryInProgress) {
                    $scope.pageInfo.isQueryInProgress = true;
                    queryParams.page = $scope.pageInfo.number + 1;
                    queryParams.size = $scope.pageInfo.size;

                    FindServices.get(queryParams, function (services) {
                            if (services.data.content.length > 0) {
                                $scope.pageInfo.isQueryInProgress = false;
                                $scope.services = $scope.services.concat(services.data.content);
                            }
                            $scope.pageInfo = BY.byUtil.getPageInfo(services.data);
                            $scope.pageInfo.isQueryInProgress = false;
                            $("#preloader").hide();
                        },
                        function (error) {
                            $("#preloader").hide();
                            console.log("Services on city not found");
                        });
                }
            }

            $scope.showAllServices = function ($event, service) {
                var parentNode = $($event.target.parentElement),
                    linkNode = parentNode.find(".serviceShowMoreLink"),
                    iconNode = parentNode.find(".serviceShowMoreIcon");

                service.showMoreServices = (service.showMoreServices === false) ? true : false;
                var linkText = (linkNode.text().trim() === "Show all") ? "Show less" : "Show all";
                linkNode.text(linkText);

                if (service.showMoreServices) {
                    iconNode.addClass("fa-angle-up");
                    iconNode.removeClass("fa-angle-down");
                } else {
                    iconNode.removeClass("fa-angle-up");
                    iconNode.addClass("fa-angle-down");
                }
            }


            $scope.isAllowedToReview = function (service) {
                if (localStorage.getItem("USER_ID") !== service.userId) {
                    return true;
                } else {
                    return false;
                }
            }
            
            
            
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
            	 if(profile && profile.basicProfileInfo.firstName && profile.basicProfileInfo.firstName.length > 0){
            		 proTitle = profile.basicProfileInfo.firstName;
            		 if(profile.individualInfo.lastName && profile.individualInfo.lastName != null && profile.individualInfo.lastName.length > 0){
            			 proTitle = proTitle + " " + profile.individualInfo.lastName;
            		 }
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

        ServicesController.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams',
            'FindServices', '$sce'];
        byApp.registerController('ServicesController', ServicesController);
        return ServicesController;
    });
