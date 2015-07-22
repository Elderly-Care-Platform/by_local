//DIscuss All
byControllers.controller('ServicesController', ['$scope', '$rootScope', '$location', '$route', '$routeParams',
    'FindServices', '$sce',
    function ($scope, $rootScope, $location, $route, $routeParams, FindServices, $sce) {

        var a = $(".header .navbar-nav > li.dropdown");
        a.removeClass("dropdown");
        setTimeout(function () {
            a.addClass("dropdown")
        }, 200);

        var city = $routeParams.city;
        var serviceCategory = $routeParams.services;
        var queryParams = {page: 0, size: 10};

        if (serviceCategory && serviceCategory !== "" && serviceCategory !== "all") {
            queryParams.services = serviceCategory;
        }

        if (city && city !== "" && city !== "all") {
            queryParams.city = city;
        }

        $scope.findViews = {};
        $scope.findViews.leftPanel = "app/components/find/servicesLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.findViews.contentPanel = "app/components/find/servicesContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.showSpecialityFilter = false;

        $scope.getProfileRating = function(service){
            service.profileRating = BY.byUtil.getAverageRating(service.ratingPercentage);
        }

        $scope.getData = function(queryParams){
            $("#preloader").show();
            $scope.services = FindServices.get(queryParams, function (services) {
                    $scope.services = services.data.content;
                    $scope.pageInfo = BY.byUtil.getPageInfo(services.data);
                    $scope.pageInfo.isQueryInProgress = false;
                    $("#preloader").hide();
                },
                function (error) {
                    console.log(error);
                });

        }


        $scope.showBreadcrums = function () {
            $rootScope.bc_topic = 'list';
            $rootScope.bc_subTopic = 'all';
            $rootScope.bc_discussType = 'all';

            $rootScope.bc_topicId = 'all';
            $rootScope.bc_subTopicId = 'all';

            var category = $rootScope.findCategoryListMap ? $rootScope.findCategoryListMap[queryParams.services] : null;
            if (category) {
                $rootScope.bc_topic = category.name;
                $rootScope.bc_subTopic = 'all';

                $rootScope.bc_topicId = category.id;
                $rootScope.bc_subTopicId = 'all';

                if (category.parentId) {
                    $rootScope.bc_subTopic = category.name;
                    $rootScope.bc_topic = $rootScope.findCategoryListMap[category.parentId].name;

                    $rootScope.bc_topicId = category.parentId;
                    $rootScope.bc_subTopicId = category.id;
                }
            }
        }

        $scope.showFilters = function(){
            var category = $rootScope.findCategoryListMap ? $rootScope.findCategoryListMap[queryParams.services] : null;
            if (category && category.parentId && category.parentId!==null && category.childCount > 0){
                $scope.showSpecialityFilter = true;
                $scope.specialities = $.map(category.children, function (value, key) {
                    return {label:value.name,value:value.name, id:value.id};
                });
            }
        }

        $scope.showBreadcrums();
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

        //Editor initialize
        $scope.add = function (type) {
        }
        //Editor post callback
        $scope.postSuccess = function () {
            $route.reload();
        }

        $scope.cityOptions = {
            types: "(cities)",
            resetOnFocusOut: false
        }

        $scope.addressCallback = function (response) {
            $('#addressCity').blur();
            queryParams = {};
            queryParams.city = response.name;
            $scope.getData(queryParams);
        }

        $scope.specialityCallback  = function (speciality){
            queryParams.services = speciality.id;
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



    }]);
