define(['menuConfig', 'userTypeConfig'], function (menuConfig, userTypeConfig) {
    function BYHeaderCtrl($rootScope, $scope, $window, $location, $http, $injector) {
        $rootScope.screenHeight = $(window).height();
        $scope.loginDetails = {
            "text": "",
            "link": ""
        }
        $scope.profileDetails = {
            "text": "",
            "link": ""
        }
        
        $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;
        $scope.telNo = BY.config.constants.byContactNumber;

        var isHomePage = false,
            initialize = initHeader();

        function initHeader() {
            validateSession();
            getProductCount();
            getServicesCount();
        }

        $scope.searchResults = function(){
            angular.forEach($location.search(), function (value, key) {
                $location.search(key, null);
            });
            if($("#SearchValue").val() != ''){
                $location.path('/search/'+ $("#SearchValue").val() +'/All');
            }            
        }
        

        function getProductCount(){
            $http.get(apiPrefix + BY.config.constants.productHost+"/catalog/productCount").success(function (response) {
                $rootScope.totalProductCount = response;
                $rootScope.$broadcast('productCountAvailable');
            }).error(function (err) {
                console.log("products count not available");
            })
        }

        function getServicesCount(){
            $http.get(apiPrefix + "api/v1/userProfile/getCount").success(function (response) {

                $rootScope.totalServiceCount = parseInt(response.data[BY.config.profile.userTypeMap['INSTITUTION_BRANCH']])
                    + parseInt(response.data[BY.config.profile.userTypeMap['INDIVIDUAL_PROFESSIONAL']]);

                $rootScope.totalHousingCount = parseInt(response.data[BY.config.profile.userTypeMap['INSTITUTION_HOUSING']]);

                $rootScope.$broadcast('directoryCountAvailable');
            }).error(function (err) {
                console.log("services count not available");
            })
        }

        function updateHeaderTemplate() {
            if (isHomePage == true) {
                $("#home").removeClass('hide');
                $("#home").addClass('show');
                //$("#home").load("app/components/home/homeStatic.html?versionTimeStamp=%PROJECT_VERSION%");
                $scope.templateUrl = 'app/components/header/homeHeader.html?versionTimeStamp=%PROJECT_VERSION%';
                // on scrolling adding header background
                angular.element($window).bind("scroll", function () {
                    var headerHeight = $(".by_header").height();
                    if ((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= headerHeight) {
                        $(".by_header").addClass("by_header_image");
                    } else {
                        $(".by_header").removeClass("by_header_image");
                    }
                    if ((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= 1) {
                        $("#homeMenuScroll").show();
                    } else {                        
                         $("#homeMenuScroll").hide();
                    }
                        
                });
            } else {
                $("#home").removeClass('show');
                $("#home").addClass('hide');
                //$("#home").html('');
                $scope.templateUrl = 'app/components/header/otherHeader.html?versionTimeStamp=%PROJECT_VERSION%';
                angular.element($window).bind("scroll", function () {
                    var headerHeight = $(".by_header").height();
                    if ((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= headerHeight) {
                        $(".by_header").addClass("by_header_image");

                    } else {
                        $(".by_header").addClass("by_header_image");
                    }
                });
            }
        }

        function validateSession() {
            if (window.localStorage) {
                require(["userValidation"], function(userValidation) {
                    $scope.UserValidationFilter  = $injector.get('UserValidationFilter');
                    var validateSessionPromise = $scope.UserValidationFilter.validateSession();
                    validateSessionPromise.then(setValidSession, inValidateSession);
                    //$scope.$apply();
                });
            }
        }

        function setValidSession(params) {
            var userName = localStorage.getItem("USER_NAME");
            var sessionId = localStorage.getItem("SessionId");

            if(userName.length > 9){
                userName = localStorage.getItem("USER_NAME").substring(0, 9)+'...';
            }

            $scope.loginDetails.text = "Logout";
            $scope.loginDetails.link = "#!/users/logout/" + sessionId;

            $scope.profileDetails.text = BY.byUtil.validateUserName(userName);
            $scope.profileDetails.link = "#!/users/registrationProfile/";
        }

        function inValidateSession() {
            $scope.profileDetails.text = "";
            $scope.profileDetails.link = "";

            $scope.loginDetails.text = "Join us";
            $scope.loginDetails.link = "#!/users/login";
        }

        $scope.$on('byUserLogout', function (event, args) {
            inValidateSession();
        });

        $scope.$on('byUserLogin', function (event, args) {
            setValidSession(args);
        });

        $scope.$on('byUserNameUpdate', function (event, args) {
            setValidSession(args);
        });


        $scope.$on('currentLocation', function (event, args) {
            if (args === '/') {
                $rootScope.BYhomePage = true;
                isHomePage = true;                
                $("#ng-scope").css('min-height', "0px");
            } else {
                $rootScope.BYhomePage = false;
                isHomePage = false;
                var minimumHeight = $( window ).height() - 46;
                $("#ng-scope").css('min-height', minimumHeight+"px");
            }

            updateHeaderTemplate();
        });

        $scope.searchInputShow = function () {
            if ($(".by_header_right_search").css('display') == 'none') {
                $(".by_header_right_search").fadeIn('1000');
            } else {
                $scope.searchResults();
            }
        };

        $scope.homeSection = BY.config.menu.home;
        $scope.moduleConfig= BY.config.menu.moduleConfig;
    }

    BYHeaderCtrl.$inject = ['$rootScope', '$scope', '$window', '$location', '$http', '$injector'];
    return BYHeaderCtrl;
});



