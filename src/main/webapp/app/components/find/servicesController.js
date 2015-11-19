//DIscuss All
define(['byApp', 'byUtil', 'userTypeConfig'],
    function (byApp, byUtil, userTypeConfig) {

        function ServicesController($scope, $rootScope, $location, $route, $routeParams, FindServices, $sce, broadCastMenuDetail) {
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

            var city                        = $routeParams.city,
                tags                        = [],
                queryParams                 = {p: 0, s: 10};

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
                        //broadCastMenuDetail.setMenuId($scope.selectedMenu);
                    },
                    function (error) {
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
                var metaTagParams = {
                    title: $scope.selectedMenu.displayMenuName,
                    imageUrl: "",
                    description: "",
                    keywords: [$scope.selectedMenu.displayMenuName, $scope.selectedMenu.slug]
                }
                BY.byUtil.updateMetaTags(metaTagParams);
            }

            $scope.profileImage = function (service) {
                service.profileImage = BY.config.profile.userType[service.userTypes[0]].profileImage;
            }

            $scope.trustForcefully = function (html) {
                return $sce.trustAsHtml(html);
            }

            $scope.location = function ($event, userId, userType) {
                $event.stopPropagation();
                if (userId && userType.length > 0) {
                    $location.path('/profile/' + userType[0] + '/' + userId);
                }
            }

           
            $scope.cityOptions = {
                types: "(cities)",
                resetOnFocusOut: false
            }

            $scope.addressCallback = function (response) {
                var menu = $scope.selectedMenu;
                $location.search('showEditor', null);
                $location.search('showEditorType', null);
                $location.search('postCategoryTag', null);
                if(menu.module == $scope.menuConfig.modules['discuss'].moduleId){
                    menu = $rootScope.menuCategoryMap['56406cd03e60f5b66f62df26'];
                }
                $location.path("/services/list/"+menu.slug+"/"+menu.id+"/"+response.name);
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
        }

        ServicesController.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams',
            'FindServices', '$sce', 'broadCastMenuDetail'];
        byApp.registerController('ServicesController', ServicesController);
        return ServicesController;
    });
