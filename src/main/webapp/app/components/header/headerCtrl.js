define(['menuConfig', 'userTypeConfig'], function (menuConfig, userTypeConfig) {
    function BYHeaderCtrl($rootScope, $scope, $window, $http, SessionIdService) {
        $rootScope.screenHeight = $(window).height();
        $scope.loginDetails = {
            "text": "",
            "link": "",
        }
        $scope.profileDetails = {
            "text": "",
            "link": ""
        }

        $scope.telNo = BY.config.constants.byContactNumber;

        var isHomePage = false,
            initialize = initHeader();

        function initHeader() {
            validateSession();
            getProductCount();
            getServicesCount();
        }
        

        function getProductCount(){
            $http.get(BY.config.constants.productHost+"/catalog/productCount").success(function (response) {
                $rootScope.totalProductCount = response;
                $rootScope.$broadcast('productCountAvailable');
            }).error(function (err) {
                console.log("products count not available");
            })
        }

        function getServicesCount(){
            $http.get("api/v1/userProfile/getCount").success(function (response) {

                $rootScope.totalServiceCount = parseInt(response.data[BY.config.profile.userTypeMap['INSTITUTION_SERVICES']])
                    + parseInt(response.data[BY.config.profile.userTypeMap['INDIVIDUAL_PROFESSIONAL']]);

                $rootScope.totalHousingCount = parseInt(response.data[BY.config.profile.userTypeMap['INSTITUTION_HOUSING']]);

                $rootScope.$broadcast('directoryCountAvailable');
            }).error(function (err) {
                console.log("services count not available");
            })
        }

        function updateHeaderTemplate() {
            if (isHomePage == true) {
                $("#home").show();
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
                    if ((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= 300) {
                        $("#homeMenuScroll").show();
                    } else {                        
                         $("#homeMenuScroll").hide();
                    }
                        
                });
            } else {
                $("#home").hide();
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
                $http.defaults.headers.common.sess = localStorage.getItem("SessionId");
                $http.get("api/v1/users/validateSession").success(function (response) {
                    var sess = localStorage.getItem("SessionId");
                    if (sess != '' && sess != null) {
                        setValidSession({'sessionId':sess});
                        if (window.location.href.endsWith("#!/users/login") || window.location.href.endsWith("main.html")) {
                            window.location = apiPrefix + "#!/users/home?type=home";
                        }
                    }

                }).error(function (err) {
                    inValidateSession();
                })
            }

        }

        function setValidSession(params) {
            var userName = localStorage.getItem("USER_NAME");
            if(userName.length > 9){
                userName = localStorage.getItem("USER_NAME").substring(0, 9)+'...';
            }

            $scope.loginDetails.text = "Logout";
            $scope.loginDetails.link = apiPrefix + "#!/users/logout/" + params.sessionId;

            $scope.profileDetails.text = BY.byUtil.validateUserName(userName);
            $scope.profileDetails.link = apiPrefix + "#!/users/registrationProfile/";

            //$("#profile_placeholder").show();
            
        }

        function inValidateSession() {
            localStorage.setItem("SessionId", "");
            localStorage.setItem("USER_ID", "");
            localStorage.setItem("USER_NAME", "");

            $scope.profileDetails.text = "";
            $scope.profileDetails.link = "";

            $scope.loginDetails.text = "Join us";
            $scope.loginDetails.link = apiPrefix + "#!/users/login";
            //$("#profile_placeholder").hide();
            

            $http.defaults.headers.common.sess = "";
            SessionIdService.setSessionId("");
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
            if (args === '/' || args.indexOf('/users/home') > -1) {
                isHomePage = true;                
                $("#ng-scope").css('min-height', "0px");
            } else {
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
                document.getElementById('search_link').click()
            }
        };

        $scope.animateCounter = function (count, target) {
            $({someValue: 0}).animate({someValue: count}, {
                duration: cntAnimDuration,
                easing: 'swing',
                step: function () {
                    target.text(Math.round(this.someValue));
                }
            });
        };

        $scope.homeSection = BY.config.menu.home;        
        $scope.moduleConfig= BY.config.menu.moduleConfig;
    }

    BYHeaderCtrl.$inject = ['$rootScope', '$scope', '$window', '$http', 'SessionIdService'];
    return BYHeaderCtrl;
});



