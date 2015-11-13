define(['menuConfig'], function (menuConfig) {
    function BYHeaderCtrl($scope, $window, $http, SessionIdService) {
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
            updateHeaderTemplate();
            validateSession();
        }

        function updateHeaderTemplate() {
            if (isHomePage == true) {
                $scope.templateUrl = 'app/components/header/homeHeader.html?versionTimeStamp=%PROJECT_VERSION%';
                // on scrolling adding header background
                angular.element($window).bind("scroll", function () {
                    var headerHeight = $(".by_header").height();
                    if ((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= headerHeight) {
                        $(".by_header").addClass("by_header_image");

                    } else {
                        $(".by_header").removeClass("by_header_image");
                    }
                });
            } else {
                $scope.templateUrl = 'app/components/header/otherHeader.html?versionTimeStamp=%PROJECT_VERSION%';
                 $(".by_header").addClass("by_header_image");
            }
        }

        function validateSession() {
            if (window.localStorage) {
                $http.defaults.headers.common.sess = localStorage.getItem("SessionId");
                $http.get("api/v1/users/validateSession").success(function (response) {
                    var sess = localStorage.getItem("SessionId");
                    if (sess != '' && sess != null) {
                        //var log = document.getElementById('login_placeholder');
                        $scope.loginDetails.text = "Logout";
                        $scope.loginDetails.link = apiPrefix + "#!/users/logout/" + sess;
                        //document.getElementById("login_placeHolder_li").style.display = "inline";

                        //var pro = document.getElementById('profile_placeholder');

                        var userName = localStorage.getItem("USER_NAME");
                        $scope.profileDetails.text = BY.byUtil.validateUserName(userName);
                        $scope.profileDetails.link = apiPrefix + "#!/users/registrationProfile/";

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
            $scope.loginDetails.text = "Logout";
            $scope.loginDetails.link = apiPrefix + "#!/users/logout/" + params.sessionId;

            $scope.profileDetails.text = BY.byUtil.validateUserName(userName);
            $scope.profileDetails.link = apiPrefix + "#!/users/registrationProfile/";
        }

        function inValidateSession() {
            localStorage.setItem("SessionId", "");
            localStorage.setItem("USER_ID", "");
            localStorage.setItem("USER_NAME", "");

            $scope.loginDetails.text = "";
            $scope.loginDetails.link = "";

            $scope.profileDetails.text = "Join us";
            $scope.profileDetails.link = apiPrefix + "#!/users/login";

            $http.defaults.headers.common.sess = "";
            SessionIdService.setSessionId("");
        }

        $scope.$on('byUserLogout', function (event, args) {
            inValidateSession();
        });

        $scope.$on('byUserLogin', function (event, args) {
            setValidSession(args);
        });

        $scope.$on('currentLocation', function (event, args) {
            //console.log(args);
            if (args === '/' || args.indexOf('/users/home') > -1) {
                isHomePage = true;
            } else {
                isHomePage = false;
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

        $scope.homeSection = BY.config.home;
    }

    BYHeaderCtrl.$inject = ['$scope', '$window', '$http', 'SessionIdService'];
    return BYHeaderCtrl;
});



