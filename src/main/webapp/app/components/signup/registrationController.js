 //$.ajax({url: apiPrefix +'api/v1/menu/getMenu?parentId=root', success: function(response){
 //             window.by_menu = response;
 //             angular.bootstrap(document, ["byApp"]);
 //         }});

byControllers.controller('RegistrationController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'UserProfile',
    function ($scope, $rootScope, $http, $location, $routeParams, UserProfile) {

        $scope.views = {};
        $scope.views.leftPanel = "";
        $scope.profile = null;
        $scope.housingFacilityTabs = [];

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
            $scope.views.contentPanel = "app/components/signup/login/modifyUsername.html?versionTimeStamp=%PROJECT_VERSION%";
        };
        $scope.changePassword = function (elemClassName) {
            $(".list-group-item").removeClass('active');
            $("."+elemClassName).addClass('active');
            $scope.views.contentPanel = "app/components/signup/login/modifyPassword.html?versionTimeStamp=%PROJECT_VERSION%";
        };

        $scope.editUserProfile = function (elemClassName) {
            if ($scope.profile && $scope.profile.userTypes && $scope.profile.userTypes.length) {
                $(".list-group-item").removeClass('active');
                $("."+elemClassName).addClass('active');
                $scope.views.contentPanel = $scope.userTypeConfig.contentPanel;
            } else {
                $scope.getUserProfile();
                $(".list-group-item").removeClass('active');
                $("."+elemClassName).addClass('active');
            }
        };

        $scope.getUserProfile = function (regLevel) {
            $scope.userId = localStorage.getItem("USER_ID");
            $scope.userName = localStorage.getItem("USER_NAME");

            $scope.userProfile = UserProfile.get({userId: $scope.userId}, function (profile) {
                $scope.profile = profile.data;
                if ($scope.profile.userTypes.length > 0) {
                    $scope.userTypeConfig = BY.config.regConfig.userTypeConfig[$scope.profile.userTypes[0]];
                    $scope.views.contentPanel = $scope.userTypeConfig.contentPanel;
                    $scope.views.leftPanel = $scope.userTypeConfig.leftPanel;
                    $scope.sectionLabel = $scope.userTypeConfig.label;

                    if($scope.profile.userTypes[0]===3){
                        //$scope.sectionLabel = "";
                        //if($scope.profile.facilities && $scope.profile.facilities.length > 0){
                        //    $scope.sectionLabel = null;
                        //    for(var i=0; i<$scope.profile.facilities.length; i++){
                        //        if($scope.profile.facilities[i].name && $scope.profile.facilities[i].name.trim().length > 0){
                        //            $scope.housingFacilityTabs.push($scope.profile.facilities[i].name);
                        //        }
                        //    }
                        //}
                        //
                        //if($routeParams.facilityIndex){
                        //    $scope.housingFacilityTabs.push("Facility"+$routeParams.facilityIndex);
                        //}
                    }
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

        $scope.showFacility = function(facilityIdx){
            $location.path('/users/housingRegistration/'+ facilityIdx);
        }

    }]);
