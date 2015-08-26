byControllers.controller('RegistrationController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'UserProfile',
    function ($scope, $rootScope, $http, $location, $routeParams, UserProfile) {

        $scope.views = {};
        $scope.views.leftPanel = "";
        $scope.profile = null;

        (function () {
            var metaTagParams = {
                title: "Beautiful Years | Registration",
                imageUrl: "",
                description: ""
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        })();

        $scope.changeUsername = function (elemClassName) {
            $(".list-group-item").removeClass('active');
            $("."+elemClassName).addClass('active');
            $scope.views.contentPanel = "app/components/signup/login/modifySignup.html?versionTimeStamp=%PROJECT_VERSION%";
        };
        
      

        $scope.editUserProfile = function (elemClassName) {
            if ($scope.profile && $scope.profile.userTypes && $scope.profile.userTypes.length) {
                $(".list-group-item").removeClass('active');
                $("."+elemClassName).addClass('active');
                $scope.views.contentPanel = $scope.userTypeConfig.contentPanel;
            } else {
                $scope.getUserProfile();
            }
        };

        $scope.getUserProfile = function (regLevel) {
            $scope.userId = localStorage.getItem("USER_ID");
            $scope.userProfile = UserProfile.get({userId: $scope.userId}, function (profile) {
                $scope.profile = profile.data;
                if ($scope.profile.userTypes.length > 0) {
                    $scope.userTypeConfig = BY.config.regConfig.userTypeConfig[$scope.profile.userTypes[0]];
                    $scope.views.contentPanel = $scope.userTypeConfig.contentPanel;
                    $scope.views.leftPanel = $scope.userTypeConfig.leftPanel;
                    $scope.sectionLabel = $scope.userTypeConfig.label;
                    if (!$scope.views.contentPanel || $scope.views.contentPanel == "") {
                        $scope.exit();
                    }
                } else {
                    $scope.views.contentPanel = BY.config.regConfig.userTypeConfig[-1].contentPanel;
                    $scope.views.leftPanel = BY.config.regConfig.userTypeConfig[-1].leftPanel;
                }
            });
        }

        if (localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined) {
            $scope.views.leftPanel = "app/components/signup/login/loginLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            $scope.views.contentPanel = "app/components/signup/login/login.html?versionTimeStamp=%PROJECT_VERSION%";
        } else {
            $scope.getUserProfile();
        }

        $scope.exit = function () {
            if ($rootScope.nextLocation) {
                $location.path($rootScope.nextLocation);
            }
            else {
                $location.path("/users/home");
            }
        }

    }]);
