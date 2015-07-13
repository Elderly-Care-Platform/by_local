//DIscuss All
byControllers.controller('ServicesController', ['$scope', '$rootScope', '$location', '$route', '$routeParams',
    'FindServices', '$sce',
    function ($scope, $rootScope, $location, $route, $routeParams, FindServices, $sce) {

        var a = $(".header .navbar-nav > li.dropdown");
        a.removeClass("dropdown");
        setTimeout(function () {
            a.addClass("dropdown")
        }, 200);

        $scope.findViews = {};
        $scope.findViews.leftPanel = "app/components/find/servicesLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.findViews.contentPanel = "app/components/find/servicesContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";


        $scope.findType = $routeParams.findType;
        $scope.findTypeId = $routeParams.findTypeId;

        $("#preloader").show();
        $scope.services = FindServices.get({}, function (services) {
                $scope.services = services;
                $("#preloader").hide();
            },
            function (error) {
                console.log("DiscussAllForDiscussType");
//                alert("error");
            });

        $rootScope.bc_topic = 'list';
        $rootScope.bc_subTopic = 'all';
        $rootScope.bc_discussType = $scope.findType;

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.go = function ($event, type, id, discussType) {
            $event.stopPropagation();
            if (type === "id") {
                $location.path('/profile/0/'+id);
            }
        }

        //Editor initialize
        $scope.add = function (type) {
        };
        //Editor post callback
        $scope.postSuccess = function () {
            $route.reload();
        };


    }]);
