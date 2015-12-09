define(['byApp', 'byUtil', 'LoginController', 'registrationConfig'], function(byApp, byUtil, LoginController, registrationConfig) {
    function RegistrationController($scope, $rootScope, $http, $location, $routeParams, UserProfile){
        $scope.views = {};
        $scope.views.leftPanel = "";
        $scope.profile = null;
        $scope.housingFacilityTabs = [];
        $scope.userType = null;
        $scope.facilityIdx = $routeParams.facilityIndex ? parseInt($routeParams.facilityIndex) : 0;
        $scope.institutionBranchTabs = [];
        $scope.branchIdx = $routeParams.branchIndex ? parseInt($routeParams.branchIndex) : 0;

        var changeUsername = function () {
            window.scrollTo(0, 0);
            $(".by_profileDetailed_menu").removeClass('by_profileDetailed_menuActive');
            $(".username").addClass('by_profileDetailed_menuActive');
            $scope.views.leftPanel = "app/components/signup/registrationLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            $scope.views.contentPanel = "app/components/signup/login/modifyUsername.html?versionTimeStamp=%PROJECT_VERSION%";
        };
        var changePassword = function () {
            window.scrollTo(0, 0);
            $(".by_profileDetailed_menu").removeClass('by_profileDetailed_menuActive');
            $(".password").addClass('by_profileDetailed_menuActive');
            $scope.views.leftPanel = "app/components/signup/registrationLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            $scope.views.contentPanel = "app/components/signup/login/modifyPassword.html?versionTimeStamp=%PROJECT_VERSION%";
        };

        var showOrderHistory = function () {
            window.scrollTo(0, 0);
            $(".by_profileDetailed_menu").removeClass('by_profileDetailed_menuActive');
            $(".orderHistory").addClass('by_profileDetailed_menuActive');
            $scope.views.leftPanel = "app/components/signup/registrationLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            $scope.views.contentPanel = "app/components/product/orderHistory/order-history.html?versionTimeStamp=%PROJECT_VERSION%";
        };

        $scope.leftPanelHeight = function(){            
            var clientHeight = $( window ).height() - 57;
            $(".by_menuDetailed").css('height', clientHeight+"px");
        }

        $scope.subMenuTabMobileShow = function () {
            $(".by_mobile_leftPanel_image").click(function () {
                if ($(".by_mobile_leftPanel_hide").css('left') == '0px') {
                    $(".by_mobile_leftPanel_image").animate({left: "0%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburgerG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "-90%"}, {duration: 400});
                } else {
                    $(".by_mobile_leftPanel_image").animate({left: "90%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger-minG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "0%"}, {duration: 400});
                }
            });
        };


        //$scope.editUserProfile = function (elemClassName) {
        //    if ($scope.profile && $scope.profile.userTypes && $scope.profile.userTypes.length) {
        //        $(".list-group-item").removeClass('active');
        //        $("."+elemClassName).addClass('active');
        //        $scope.views.contentPanel = $scope.userTypeConfig.contentPanel;
        //    } else {
        //        $scope.getUserProfile();
        //        $(".list-group-item").removeClass('active');
        //        $("."+elemClassName).addClass('active');
        //    }
        //};

        var showHousingLeftPanel = function(){
            if($scope.profile.facilities && $scope.profile.facilities.length > 0){
                for(var i=0; i<$scope.profile.facilities.length; i++){
                    if($scope.profile.facilities[i].name && $scope.profile.facilities[i].name.trim().length > 0){
                        $scope.housingFacilityTabs.push($scope.profile.facilities[i].name);
                    } else{
                        $scope.housingFacilityTabs.push("Facility"+(i+1));
                    }
                    if($scope.facilityIdx==i){
                        $scope.facilityProfileId = $scope.profile.facilities[i].id;
                    }
                }
            }

            if($routeParams.facilityIndex){
                if($scope.facilityIdx > $scope.profile.facilities.length){
                    $scope.housingFacilityTabs.push("Facility"+$scope.facilityIdx);
                    $scope.facilityIdx = $scope.facilityIdx - 1;
                }
            }
        };

        var showInstitutionLeftPanel = function(){
            if($scope.profile.serviceBranches && $scope.profile.serviceBranches.length > 0){
                for(var i=0; i<$scope.profile.serviceBranches.length; i++){
                    if($scope.profile.serviceBranches[i].name && $scope.profile.serviceBranches[i].name.trim().length > 0){
                        $scope.institutionBranchTabs.push($scope.profile.serviceBranches[i].name);
                    } else{
                        $scope.institutionBranchTabs.push("serviceBranches"+(i+1));
                    }
                    if($scope.branchIdx==i){
                        $scope.branchProfileId = $scope.profile.serviceBranches[i].id;
                    }
                }
            }

            if($routeParams.branchIndex){
                if($scope.branchIdx > $scope.profile.serviceBranches.length){
                    $scope.institutionBranchTabs.push("serviceBranches"+$scope.branchIdx);
                    $scope.branchIdx = $scope.branchIdx - 1;
                }
            }
        };

        var updateContentPanel = function(){
            if($routeParams.changeUserName) {
                require(["modifySignupCtrl"], function(regCtrl) {
                    changeUsername();
                    $scope.$apply();
                });

            } else if($routeParams.changeUserPwd){
                require(["modifySignupCtrl"], function(regCtrl) {
                    changePassword();
                    $scope.$apply();
                });
            } else if($routeParams.showOrderHistory){
                require(["orderHistoryCtrl"], function(orderHistoryCtrl) {
                    showOrderHistory();
                    $scope.$apply();
                });
            } else{
                require([$scope.userTypeConfig.controller], function(regCtrl) {
                    $scope.views.contentPanel = $scope.userTypeConfig.contentPanel;
                    $scope.$apply();
                    if (!$scope.views.contentPanel || $scope.views.contentPanel == "") {
                        $scope.exit();
                    }

                });
            }
        };

        $scope.getUserProfile = function (regLevel) {
            $scope.userId = localStorage.getItem("USER_ID");
            $scope.userName = localStorage.getItem("USER_NAME");

            $scope.userProfile = UserProfile.get({userId: $scope.userId}, function (profile) {
                $scope.profile = profile.data;
                if ($scope.profile.userTypes.length > 0) {
                    $scope.userTypeConfig = BY.config.regConfig.userTypeConfig[$scope.profile.userTypes[0]];
                } else {
                    $scope.userTypeConfig = BY.config.regConfig.userTypeConfig[-1];
                }

                $scope.views.leftPanel = $scope.userTypeConfig.leftPanel;
                updateContentPanel();
                if($scope.profile.userTypes[0]===3){
                    showHousingLeftPanel();
                }
                if($scope.profile.userTypes[0]===4){
                    showInstitutionLeftPanel();
                }


                //if($routeParams.changeUserName) {
                //    require(["modifySignupCtrl"], function(regCtrl) {
                //        $scope.changeUsername();
                //        $scope.$apply();
                //    });
                //
                //} else if($routeParams.changeUserPwd){
                //    require(["modifySignupCtrl"], function(regCtrl) {
                //        $scope.changePassword();
                //        $scope.$apply();
                //    });
                //} else{
                //    require([BY.config.regConfig.userTypeConfig[-1].controller], function(regCtrl) {
                //        $scope.views.contentPanel = BY.config.regConfig.userTypeConfig[-1].contentPanel;
                //        $scope.$apply();
                //    });
                //}
            });
        }


        $scope.exit = function () {
            if ($rootScope.nextLocation) {
                $location.path($rootScope.nextLocation);
                $rootScope.nextLocation = null;
            }
            else {
                $location.path("/users/home");
            }
        }

        $scope.showFacility = function(facilityIdx){
            $location.path('/users/housingRegistration/'+ facilityIdx);
        }
        

        $scope.initialize = function(){
            var metaTagParams = {
                title: "Beautiful Years | Registration",
                imageUrl: "",
                description: "",
                keywords:[]
            }
            BY.byUtil.updateMetaTags(metaTagParams);

            if (localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined) {
                $scope.views.leftPanel = "app/components/signup/login/loginLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
                $scope.views.contentPanel = "app/components/signup/login/login.html?versionTimeStamp=%PROJECT_VERSION%";
            } else{
                $scope.getUserProfile();
            }
        };
    }

    RegistrationController.$inject = ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'UserProfile'];
    byApp.registerController('RegistrationController', RegistrationController);

    return RegistrationController;
});