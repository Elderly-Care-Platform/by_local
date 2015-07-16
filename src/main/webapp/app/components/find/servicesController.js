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
        var services = $routeParams.services;
        var queryParams = {page:0,size:10};

        if (services && services !== "" && services !== "all") {
            queryParams.services = services;
        }

        if (city && city !== "" && city !== "all") {
            queryParams.city = city;
        }

        $scope.findViews = {};
        $scope.findViews.leftPanel = "app/components/find/servicesLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.findViews.contentPanel = "app/components/find/servicesContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";


        $("#preloader").show();
        $scope.services = FindServices.get(queryParams, function (services) {
                $scope.services = services.data.content;
                $scope.pageInfo = BY.byUtil.getPageInfo(services.data);
                $scope.pageInfo.isQueryInProgress = false;
                $("#preloader").hide();
            },
            function (error) {
                console.log("DiscussAllForDiscussType");
//                alert("error");
            });

        $rootScope.bc_topic = 'list';
        $rootScope.bc_subTopic = 'all';
        $rootScope.bc_discussType = 'all';

        var category = $rootScope.findCategoryListMap[queryParams.services];
        if (category) {
            $rootScope.bc_topic = category.name;
            $rootScope.bc_subTopic = 'all';
            if (category.parentId) {
                $rootScope.bc_subTopic = category.name;
                $rootScope.bc_topic = $rootScope.findCategoryListMap[category.parentId].name;
            }
        }

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.go = function ($event, type, id, discussType) {
            $event.stopPropagation();
            if (type === "id") {
                $location.path('/profile/0/' + id);
            }
        }

        //Editor initialize
        $scope.add = function (type) {
        };
        //Editor post callback
        $scope.postSuccess = function () {
            $route.reload();
        };

        $scope.cityOptions = {

            types: "(cities)",
            resetOnFocusOut: false
        };

        $scope.addressCallback = function (response) {
            $('#addressCity').blur();
            queryParams = {};
            queryParams.city = response.name;
            $("#preloader").show();
            $scope.services = FindServices.get(queryParams, function (services) {
                    $scope.services = services.data.content;
                    $scope.pageInfo = BY.byUtil.getPageInfo(services.data);
                    $scope.pageInfo.isQueryInProgress = false;
                    $("#preloader").hide();
                },
                function (error) {
                    console.log("Services on city not found");
                });
        }


        $scope.loadMore = function($event){
            if($scope.pageInfo && !$scope.pageInfo.lastPage && !$scope.pageInfo.isQueryInProgress ){
                $scope.pageInfo.isQueryInProgress = true;
                queryParams.page = $scope.pageInfo.number + 1;
                queryParams.size = $scope.pageInfo.size;

                FindServices.get(queryParams, function (services) {
                    if(services.data.content.length > 0){
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
