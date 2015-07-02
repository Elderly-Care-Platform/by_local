byControllers.controller('BYAboutUsController', ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', 'HomeFeaturedContent', 'Discuss', '$sce',
    function ($scope, $rootScope, $routeParams, $timeout, $location, HomeFeaturedContent, Discuss, $sce) {
        $scope.currentAcceleratorSelected = "";
        $scope.currentView = "aboutUs";

        $scope.$watch("articles", function (value) {
            $timeout(
                function () {
                    $scope.scroll($scope.currentAcceleratorSelected)
                }, 100);
        });
        $scope.aboutUsViews = {};
        $scope.aboutUsViews.contentPanel = "app/components/aboutUs/aboutUsContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";


        $scope.add = function (type) {
            BY.removeEditor();
            if (localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined) {
                $rootScope.nextLocation = $location.path();
                $location.path('/users/login');
            }
            else {
                $scope.error = "";
                $scope.currentView = "editor";
                $scope.aboutUsViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
                window.scrollTo(0, 0);
            }
        };


        $scope.postSuccess = function () {
            $scope.aboutUsViews.contentPanel = "app/components/aboutUs/aboutUsContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        };


        $scope.accelerate = function (id) {
            $scope.currentAcceleratorSelected = id;
            if ($scope.currentView === "editor") {
                $scope.aboutUsViews.contentPanel = "app/components/aboutUs/aboutUsContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
                $timeout(
                    function () {
                        $scope.scroll($scope.currentAcceleratorSelected);
                    }, 100);
            } else {
                $scope.scroll($scope.currentAcceleratorSelected);
            }

        }

        $scope.scroll = function (id) {
            if (id) {
                var tag = $("#" + id + ":visible");
                if (tag.length > 0) {
                    $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, 'slow');
                }
            } else {
                window.scrollTo(0, 0);
            }
        }


    }]);