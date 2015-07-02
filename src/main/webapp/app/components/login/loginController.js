byControllers.controller('LoginController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'User',
    function ($scope, $rootScope, $http, $location, $routeParams, User) {
		window.scrollTo(0, 0);
        $scope.signupViews = {};
        $scope.signupViews.leftPanel = "app/components/login/signUpLeftPanel.html";
        $scope.signupViews.contentPanel = "app/components/login/login.html";

        $scope.user = {};
        $scope.user.email = '';
        $scope.user.password = '';
        $scope.regLevel = 0;
        $scope.setView = function(level){
        	if(level===1){
        		$scope.signupViews.contentPanel = "app/components/login/user_i_am.html";
        		$scope.regLevel = 1;
        	}
        }
        
        $scope.loginUser = function (user) {
            $scope.resetError();
            $http.post(apiPrefix + 'api/v1/users/login', user).success(function (login) {
                if (login.sessionId === null) {
                	$http.defaults.headers.common.sess = "";
                    $scope.setError(login.status);
                    return;
                }
                $scope.user.email = '';
                $scope.user.password = '';
                $rootScope.sessionId = login.sessionId;
                $rootScope.bc_discussType = 'All';
                $rootScope.bc_username = login.userName;
                $rootScope.bc_userId = login.userId;
//                $scope.setUserCredential();

                if ("localStorage" in window) {
                    localStorage.setItem("SessionId", login.sessionId);
                    $http.defaults.headers.common.sess = login.sessionId;
                    localStorage.setItem("USER_ID", login.userId);
                    localStorage.setItem("USER_NAME", login.userName);
                    if($rootScope.nextLocation)
					{
						$location.path($rootScope.nextLocation);
					}
					else
					{
						$location.path("/users/home");
					}
                    document.getElementById("login_placeHolder_li").style.opacity = "1";
                    var element = document.getElementById("login_placeholder");
                    element.innerHTML = "Logout";
                    element.href = apiPrefix + "#/users/logout/" + login.sessionId;

                    var pro = document.getElementById('profile_placeholder');
                    pro.innerHTML = "Profile";
                    pro.href = "javascript:void(0);";

                }
                else {
                    $scope.setError('Browser does not support cookies');
                    $location.path("/users/login");
                }


            }).error(function () {
                $scope.error = 'Invalid user/password combination';
                $scope.message = '';
            });
        }

        $scope.resetError = function () {
            $scope.error = '';
            $scope.message = '';
        }

        $scope.setError = function (message) {
            $scope.error = message;
            $scope.message = '';
            $rootScope.SessionId = undefined;
            $http.defaults.headers.common.sess = "";
        }

        $scope.setUserCredential = function(userData){
        	 if ("localStorage" in window) {
                 localStorage.setItem("SessionId", login.sessionId);
                 localStorage.setItem("USER_ID", login.userId);
                 localStorage.setItem("USER_NAME", login.userName);
                 $location.path("/users/home");
                 document.getElementById("login_placeHolder_li").style.opacity = "1";
                 var element = document.getElementById("login_placeholder");
                 element.innerHTML = "Logout";
                 element.href = apiPrefix + "#/users/logout/" + login.sessionId;

                 var pro = document.getElementById('profile_placeholder');
                 pro.innerHTML = "Profile";
                 pro.href = "javascript:void(0);";

             }
             else {
                 $scope.setError('Browser does not support cookies');
                 $location.path("/users/login");
             }
        }
        
//     ************************   create new user start
        $scope.newUser = new User();
        $scope.pwdError = "";
        $scope.emailError = "";
        $scope.createNewUser = function(newUser) {
            var emailValidation = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(!$scope.newUser.email || $scope.newUser.email==="" || !emailValidation.test($scope.newUser.email)){
                $scope.emailError = "Please enter valid Email Id";
            }else{
                $scope.emailError = "";
                if(!$scope.newUser.password || $scope.newUser.password.trim().length < 6){
                    $scope.pwdError = "Password must be at least 6 character";
                }else{
                    $scope.pwdError = "";
                }
            }

            if($scope.pwdError==="" && $scope.emailError===""){
                $scope.newUser.$save(function (login) {
                    $scope.createUserSuccess = "User registered successfully";
                    $scope.createUserError = '';
//                $scope.setView(1);
                    if ("localStorage" in window) {
                        localStorage.setItem("SessionId", login.sessionId);
                        $http.defaults.headers.common.sess = login.sessionId;
                        localStorage.setItem("USER_ID", login.userId);
                        localStorage.setItem("USER_NAME", login.userName);
                        if($rootScope.nextLocation)
                        {
                            $location.path($rootScope.nextLocation);
                        }
                        else
                        {
                            $location.path("/users/home");
                        }
                        document.getElementById("login_placeHolder_li").style.opacity = "1";
                        var element = document.getElementById("login_placeholder");
                        element.innerHTML = "Logout";
                        element.href = apiPrefix + "#/users/logout/" + login.sessionId;

                        var pro = document.getElementById('profile_placeholder');
                        pro.innerHTML = "Profile";
                        pro.href = "javascript:void(0);";

                    }
                    else {
                        $scope.setError('Browser does not support cookies');
                        $location.path("/users/login");
                    }
                }, function (error) {
                    // failure
                    console.log("$save failed " + JSON.stringify(error));
                    $scope.createUserError = 'Email already exists. ';
                    $scope.createUserSuccess = '';

                });
            }

        }

//      ************************   create new user end

    }]);