byControllers.controller('LoginController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'User','SessionIdService','ValidateUserCredential',
    function ($scope, $rootScope, $http, $location, $routeParams, User, SessionIdService, ValidateUserCredential) {
		window.scrollTo(0, 0);
       // $scope.views.contentPanelView  = "app/components/login/signUpLeftPanel.html";

        $scope.user = {};
        $scope.user.email = '';
        $scope.user.password = '';

        $scope.newUser = new User();
        $scope.fbLogin = function(){
        	$http.get("api/v1/users/getFbURL").success(function(res){
        		window.getFbData = function(data){
        			socialRegistration(data);
        			delete(window.getFbData);
        		}
        		window.open(res.data, 'name','width=1000,height=650')
        	})
        }
        
        $scope.ggLogin = function(){
        	$http.get("api/v1/users/getGgURL").success(function(res){
        		window.getGoogleData = function(data){
        			socialRegistration(data);
        			delete(window.getGoogleData);
        		}
        		
        		window.open(res.data, 'name','width=500,height=500');
        	})
        }
        
        var socialRegistration = function(loginReg){
            if (loginReg.body.data.sessionId === null) {
            	$http.defaults.headers.common.sess = "";
                $scope.setError(loginReg.body.data.status);
                return;
            }
            $scope.user.email = '';
            $scope.user.password = '';
            $rootScope.bc_discussType = 'All'; //type for discuss list
            $scope.setUserCredential(loginReg.body.data);

            if($rootScope.inContextLogin){
                ValidateUserCredential.loginCallback();
            }
            else if($rootScope.nextLocation)
            {
                $location.path($rootScope.nextLocation);
                $scope.$apply();
            }
            else
            {
                $location.path("/users/home");
                $scope.$apply();
            }
        }
	
	
        $scope.pwdError = "";
        $scope.emailError = "";


        $scope.loginUser = function (user) {
            $scope.resetError();
            $http.post(apiPrefix + 'api/v1/users/login', user).success(function (res) {
                var login = res.data;
                if (login.sessionId === null) {
                	$http.defaults.headers.common.sess = "";
                    $scope.setError(login.status);
                    return;
                }
                $scope.user.email = '';
                $scope.user.password = '';
                $rootScope.bc_discussType = 'All'; //type for discuss list
                $scope.setUserCredential(login);

                if($rootScope.inContextLogin){
                    ValidateUserCredential.loginCallback();
                }
                else if($rootScope.nextLocation)
                {
                    $location.path($rootScope.nextLocation);
                }
                else
                {
                    $location.path("/users/home");
                }
            }).error(function () {
                $scope.setError("Invalid user/password combination");
            });
        }

//     ************************   create new user start
        $scope.createNewUser = function(newUser) {
            var emailValidation = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(!$scope.newUser.email || $scope.newUser.email==="" || !emailValidation.test($scope.newUser.email)){
                $scope.emailError = "Please enter valid Email Id";
            }else{
                $scope.emailError = "";
            }

            if(!$scope.newUser.password || $scope.newUser.password.trim().length < 6){
                $scope.pwdError = "Password must be at least 6 character";
            }else{
                $scope.pwdError = "";
            }

            if($scope.pwdError==="" && $scope.emailError===""){
                $scope.newUser.$save(function (response) {
                	var login = response.data;
                    $scope.createUserSuccess = "User registered successfully";
                    $scope.createUserError = '';
                    $scope.setUserCredential(login, "reg2");

                    if($rootScope.inContextLogin){
                        ValidateUserCredential.loginCallback();
                    } else{
                        $scope.$parent.updateRegistration();
                    }

                }, function (error) {
                    // failure
                    console.log(error);
                    $scope.createUserError = error.data.error.errorMsg;
                    $scope.createUserSuccess = '';

                });
            }
        }
//      ************************   create new user end

        $scope.resetError = function () {
            $scope.error = '';
            $scope.message = '';
        }

        $scope.setError = function (message) {
            $scope.error = message;
            $scope.message = '';
            $http.defaults.headers.common.sess = "";
        }

        $scope.setUserCredential = function(login, nextLocation){
            if ("localStorage" in window) {
            	SessionIdService.setSessionId(login.sessionId);
                $http.defaults.headers.common.sess = login.sessionId;
                localStorage.setItem("USER_ID", login.userId);
                localStorage.setItem("USER_NAME", login.userName);

                document.getElementById("login_placeHolder_li").style.opacity = "1";
                var element = document.getElementById("login_placeholder");
                element.innerHTML = "Logout";
                element.href = apiPrefix + "#/users/logout/" + login.sessionId;

                var pro = document.getElementById('profile_placeholder');
                pro.innerHTML = localStorage.getItem("USER_NAME") ?  localStorage.getItem("USER_NAME") : "Profile";
                pro.href = apiPrefix + "#/users/login/"; //******************* to be removed*************//
            }
            else {
                $scope.setError('Browser does not support cookies');
                $location.path("/users/login");
            }
        }

    }]);