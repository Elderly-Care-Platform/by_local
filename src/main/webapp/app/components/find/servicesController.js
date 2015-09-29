//DIscuss All
define(['byApp', 'byUtil', 'userTypeConfig'],
    function (byApp, byUtil, userTypeConfig) {

        function ServicesController($scope, $rootScope, $location, $route, $routeParams, FindServices, $sce, broadCastMenuDetail) {
            var a = $(".header .navbar-nav > li.dropdown");
            a.removeClass("dropdown");
            setTimeout(function () {
                a.addClass("dropdown")
            }, 200);

            $scope.findViews = {};
            $scope.findViews.leftPanel = "app/components/find/servicesLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            $scope.findViews.contentPanel = "app/components/find/servicesContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";

            $scope.showSpecialityFilter = false;
            $scope.selectedMenu = $rootScope.menuCategoryMap[$routeParams.menuId];
            $scope.showFeaturedTag = true;

            var city = $routeParams.city;
            var tags = [];
            var queryParams = {p: 0, s: 10};


            $scope.profileImage = function (service) {
                service.profileImage = BY.config.profile.userType[service.userTypes[0]].profileImage;
            }


            if ($scope.selectedMenu) {
                (function () {
                    var metaTagParams = {
                        title: $scope.selectedMenu.displayMenuName,
                        imageUrl: "",
                        description: "",
                        keywords: [$scope.selectedMenu.displayMenuName, $scope.selectedMenu.slug]
                    }
                    BY.byUtil.updateMetaTags(metaTagParams);
                })();
                $(".selected-dropdown").removeClass("selected-dropdown");
                $("#" + $scope.selectedMenu.id).parents(".by-menu").addClass("selected-dropdown");

                tags = $.map($scope.selectedMenu.tags, function (value, key) {
                    return value.id;
                })
                queryParams.tags = tags.toString();  //to create comma separated tags list
            }

            if (city && city !== "" && city !== "all") {
                queryParams.city = city;
            }

            $scope.getData = function (queryParams) {
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

            $scope.fixedMenuInitialized = function () {
                broadCastMenuDetail.setMenuId($scope.selectedMenu);
            };

            $scope.showFilters = function () {
                if ($scope.selectedMenu && $scope.selectedMenu.filterName && $scope.selectedMenu.filterName !== null && $scope.selectedMenu.children.length > 0) {
                    $scope.showSpecialityFilter = true;
                    $scope.specialities = $.map($scope.selectedMenu.children, function (value, key) {
                        return {label: value.displayMenuName, value: value.displayMenuName, obj: value};
                    });
                }
            }

            $scope.showFilters();
            $scope.getData(queryParams);

            $scope.trustForcefully = function (html) {
                return $sce.trustAsHtml(html);
            }


            $scope.location = function ($event, userId, userType) {
                $event.stopPropagation();
                if (userId && userType.length > 0) {
                    $location.path('/profile/' + userType[0] + '/' + userId);
                }
            }

            $scope.add = function (type) {
                require(['editorController'], function(editorController){
                    $scope.error = "";
                    $scope.findViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
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
            }

            $scope.addressCallback = function (response) {
                $('#addressCity').blur();
                queryParams.city = response.name;
                $scope.getData(queryParams);
            }

            $scope.specialityCallback = function (speciality) {
                tags = speciality.obj.tags[0].id;
                queryParams.tags = tags.toString();
                $scope.getData(queryParams);
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
