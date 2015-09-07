byControllers.controller('LoginController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'User','SessionIdService','ValidateUserCredential',
    function ($scope, $rootScope, $http, $location, $routeParams, User, SessionIdService, ValidateUserCredential) {
		window.scrollTo(0, 0);

        $scope.user = {};
        $scope.user.email = '';
        $scope.user.password = '';

        $scope.newUser = new User();
        $scope.formState = 0;
        

        $scope.resetPwd = {};
        $scope.resetPwd.email = '';
        $scope.resetPwd.error = '';
        $scope.resetPwd.status = 0;

        $scope.pwdError = "";
        $scope.emailError = "";

        
        if($routeParams.resetPasswordCode){
        	verifyPasswordCode($routeParams.resetPasswordCode);
        }
        
        var socialCallback = function(e){
        		socialRegistration(e.data);
        		$scope.resetError();
        	  window.removeEventListener("message", socialCallback, false);
        	}
        	
        
        function verifyPasswordCode(passCode){
            $(".by_resetPwd_btn").prop("disabled", true);
        	$http.get("api/v1/users/verifyPwdCode?verificationCode="+$routeParams.resetPasswordCode).success(function(res){
        		$scope.resetPasswordCode = $routeParams.resetPasswordCode;
                $(".by_resetPwd_btn").prop("disabled", false);
        	}).error(function(errorRes){
        		console.log(errorRes);
                $scope.resetPwd.error = errorRes.error.errorMsg;
                $(".by_resetPwd_btn").prop("disabled", true);
        	})
        }

        $scope.fbLogin = function(){
        	$http.get("api/v1/users/getFbURL").success(function(res){
        		window.addEventListener("message", socialCallback);
        		var child = window.open(res.data, 'Facebook Login','width=1000,height=650');
        		var timer = setInterval(checkChild, 500);
        		function checkChild() {
        		    if (child.closed) {
        		    	window.removeEventListener("message", socialCallback);
        		        clearInterval(timer);
        		    }
        		}
        	})
        };

        (function(){
            var metaTagParams = {
                title:  "Beautiful Years | Login",
                imageUrl:   "",
                description:   ""
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        })();

        $scope.modalLoginInit = function(){
            $scope.formState = 0;
            $rootScope.loginFormState=0;
            $('#myModalHorizontal').on('hidden.bs.modal', function () {
                $scope.user = {};
                $scope.user.email = '';
                $scope.user.password = '';

                $scope.newUser = new User();
                $scope.formState = 0;
                $rootScope.loginFormState=0;

                $scope.resetPwd = {};
                $scope.resetPwd.email = '';
                $scope.resetPwd.error = '';
                $scope.resetPwd.status = 0;

                $scope.resetError();
            })
        };

        $scope.showForm = function(formId){
            $scope.formState = formId;
            $rootScope.loginFormState=formId;
            ValidateUserCredential.login();
        };

        
        $scope.ggLogin = function(){
        	$http.get("api/v1/users/getGgURL").success(function(res){
        		window.addEventListener("message", socialCallback);
        		var child = window.open(res.data, 'Google Login','width=500,height=500');
        		var timer = setInterval(checkChild, 500);
        		function checkChild() {
        		    if (child.closed) {
        		    	window.removeEventListener("message", socialCallback);
        		        clearInterval(timer);
        		    }
        		}
        	})
        };
        
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
            } else
            {
                $location.path("/users/home");
                $scope.$apply();
            }
        };

        $scope.loginUser = function (user) {
            $scope.resetError();
            $(".login-btn").prop("disabled", true);
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
                } else{
                    $scope.$parent.exit();
                }

            }).error(function () {
                $scope.setError("Invalid user/password combination");
                $(".login-btn").prop("disabled", false);
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
                $(".register-btn").prop("disabled", true);
                $scope.newUser.$save(function (response) {
                	var login = response.data;
                    $scope.createUserSuccess = "User registered successfully";
                    $scope.createUserError = '';
                    $scope.setUserCredential(login, "reg2");

                    if($rootScope.inContextLogin){
                        ValidateUserCredential.loginCallback();
                    } else{
                        $scope.$parent.getUserProfile();
                    }

                }, function (error) {
                    // failure
                    console.log(error);
                    $(".register-btn").prop("disabled", false);
                    $scope.createUserError = error.data.error.errorMsg;
                    $scope.createUserSuccess = '';

                });
            }
        }
//      ************************   create new user end

        $scope.resetError = function () {
            $scope.error = '';
            $scope.message = '';
            $scope.pwdError = "";
            $scope.emailError = "";
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

                document.getElementById("login_placeHolder_li").style.display = "inline";
                var element = document.getElementById("login_placeholder");
                element.innerHTML = "Logout";
                element.href = apiPrefix + "#!/users/logout/" + login.sessionId;

                var pro = document.getElementById('profile_placeholder');
                var userName = localStorage.getItem("USER_NAME");
                pro.innerHTML = BY.validateUserName(userName);
                pro.href = apiPrefix + "#!/users/login/"; //******************* to be removed*************//
            }
            else {
                $scope.setError('Browser does not support cookies');
                $location.path("/users/login");
            }
        }

        $scope.emailPwdLink = function(email){
            $(".by_btn_submit").prop("disabled", true);
            $http.get(apiPrefix +"api/v1/users/resetPassword?email="+encodeURIComponent(email)).success(function(res){
                console.log(res);
                $scope.resetPwd.status = 1;
                $scope.resetPwd.error = '';
            }).error(function(errorRes){
                console.log(errorRes);
                $(".by_btn_submit").prop("disabled", false);
                $scope.resetPwd.error = errorRes.error.errorMsg;
            });
        };

        $scope.resetPassword  = function(){
            if(!$scope.resetPwd.newPwd || $scope.resetPwd.newPwd.trim().length < 6){
                $scope.resetPwd.error = "Password must be at least 6 character";
            }else{
                $scope.resetPwd.error = "";
            }

            if($scope.resetPasswordCode && $scope.resetPwd.error===""){
                var resetPwdUser = {
                    verificationCode:$scope.resetPasswordCode,
                    password:$scope.resetPwd.newPwd
                }
                $(".by_resetPwd_btn").prop("disabled", true);
                $http.post(apiPrefix + 'api/v1/users/resetPassword', resetPwdUser).success(function (res) {
                    console.log(res);
                    $location.path("/users/home");
                    $scope.setUserCredential(res.data);
                }).error(function (errorRes) {
                    console.log(errorRes);
                    $(".by_resetPwd_btn").prop("disabled", false);
                    $scope.resetPwd.error = errorRes.error.errorMsg;
                });
            }
        }

    }]);