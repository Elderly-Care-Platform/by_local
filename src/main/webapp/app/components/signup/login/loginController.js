define(['byUtil', 'registrationConfig'], function(byUtil, registrationConfig){
    function LoginController($scope, $rootScope, $http, $location, $routeParams, User, SessionIdService, ValidateUserCredential) {
        window.scrollTo(0, 0);

        $scope.byLoginPage = function(){
            $scope.views.loginPanel = "app/components/signup/login/login.html?versionTimeStamp=%PROJECT_VERSION%";
        }

        $scope.by_RegisterPage = function(){
            $scope.views.loginPanel = "app/components/signup/login/register.html?versionTimeStamp=%PROJECT_VERSION%";
        }     


        $scope.user = {};
        $scope.user.email = '';
        $scope.user.password = '';
        $scope.user.phoneNumber = '';

        $scope.newUser = new User();
        $scope.formState = $rootScope.loginFormState;


        $scope.resetPwd = {};
        $scope.resetPwd.email = '';
        $scope.resetPwd.error = '';
        $scope.resetPwd.status = 0;

        $scope.pwdError = "";
        $scope.emailError = "";
        $scope.uniqueRegId = {};
        $scope.uniqueLoginId = {};

        var storedUserEmail    = localStorage.getItem("USER_EMAIL"),
            storedUserPhoneNo  = localStorage.getItem("USER_PHONENUMBER");
        $scope.storedUserEmail = localStorage.getItem("USER_EMAIL") || localStorage.getItem("USER_PHONENUMBER");   

        if(storedUserEmail && storedUserEmail!=="null" && storedUserEmail!==""){
            $scope.uniqueLoginId.id = storedUserEmail;
            $scope.uniqueRegId.id = storedUserEmail;
        }

        if(storedUserPhoneNo && storedUserPhoneNo!=="null" && storedUserPhoneNo!==""){
            $scope.uniqueLoginId.id = localStorage.getItem("USER_PHONENUMBER");
            $scope.uniqueRegId.id = localStorage.getItem("USER_PHONENUMBER");
        }


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
            $http.get(apiPrefix + "api/v1/users/verifyPwdCode?verificationCode="+$routeParams.resetPasswordCode).success(function(res){
                $scope.resetPasswordCode = $routeParams.resetPasswordCode;
                $(".by_resetPwd_btn").prop("disabled", false);
            }).error(function(errorRes){
                console.log(errorRes);
                $scope.resetPwd.error = errorRes.error.errorMsg;
                $(".by_resetPwd_btn").prop("disabled", true);
            })
        }

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

        $scope.fbLogin = function(){
            $http.get(apiPrefix + "api/v1/users/getFbURL").success(function(res){
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
                description:   "",
                keywords:[]
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        })();

        $scope.modalLoginInit = function(){
        	if($scope.formState === undefined){
	            $scope.formState = 0;
	            $rootScope.loginFormState=0;
        	}
            

            $('#myModalHorizontal').on('hide.bs.modal', function () {
                $('body').removeClass("modal-open");
            })


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

            $('#myModalHorizontal').modal('show');
        };

        $scope.showForm = function(formId){
            $scope.formState = formId;
            $rootScope.loginFormState=formId;
            ValidateUserCredential.login();
        };


        $scope.ggLogin = function(){
            $http.get(apiPrefix + "api/v1/users/getGgURL").success(function(res){
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
            $scope.setUserCredential(loginReg.body.data);

            if($rootScope.inContextLogin){
                ValidateUserCredential.loginCallback();
            } else
            {
                $location.path("/");
                $scope.$apply();
            }
        };

        $scope.loginUser = function (user) {
        	var loginUserValue = $scope.uniqueLoginId.id;
        	//var isMobile = !isNaN(parseFloat(loginUserValue)) && isFinite(loginUserValue); 
        	var reg = /^\d+$/;
        	if(reg.test(loginUserValue))
         		{	
	        		$scope.user.userIdType = BY.config.regConfig.userIdType.mobile;
					$scope.user.phoneNumber = loginUserValue;
					delete $scope.user.email;					            		
         		} else {
         			$scope.user.userIdType = BY.config.regConfig.userIdType.email;
					$scope.user.email = loginUserValue;
					delete $scope.user.phoneNumber;
        		}
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
                $scope.user.phoneNumber = '';
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
        	if($scope.uniqueRegId && (!$scope.uniqueRegId.id || $scope.uniqueRegId.id ==="")){
        		$scope.emailError = "Please enter a valid email-id";
        	} else{              	
            	var emailMobile = $scope.uniqueRegId.id;
            	var isMobile = !isNaN(parseFloat(emailMobile)) && isFinite(emailMobile); 
            	if( isMobile == true)
             		{	            		
	            		var reg = /^\d+$/;
						if (emailMobile.length === 10 && reg.test(emailMobile)) {
							$scope.emailError = "";
							$scope.newUser.userIdType = BY.config.regConfig.userIdType.mobile;
							$scope.newUser.phoneNumber = $scope.uniqueRegId.id;
							delete $scope.newUser.email;

						} else {
							$scope.emailError = "Please enter 10 digit mobile number";
						}  
						            		
             		} else {
            			var emailValidation = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                        if(!emailValidation.test(emailMobile)){
                            $scope.emailError = "Please enter valid Email Id";
                        }else{
                            $scope.emailError = "";
                            $scope.newUser.userIdType = BY.config.regConfig.userIdType.email;
    						$scope.newUser.email = $scope.uniqueRegId.id;
    						delete $scope.newUser.phoneNumber;
                        }                       
                       
            		}
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

                    if ($rootScope.nextLocation){
                        $scope.$parent.exit();
                    } else if($rootScope.inContextLogin){
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
                localStorage.setItem("SESSION_TYPE", login.sessionType);
                localStorage.setItem("USER_EMAIL", login.userEmail);
                localStorage.setItem("USER_PHONENUMBER", login.phoneNumber);
                localStorage.removeItem("by_cust_id");
                $rootScope.$broadcast('byUserLogin', login);
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
                $scope.resetPwd.error = "Please enter valid Email ID";
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
                    $location.path("/");
                    $scope.setUserCredential(res.data);
                }).error(function (errorRes) {
                    console.log(errorRes);
                    $(".by_resetPwd_btn").prop("disabled", false);
                    $scope.resetPwd.error = errorRes.error.errorMsg;
                });
            }
        }
    }

    LoginController.$inject = ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'User','SessionIdService','ValidateUserCredential'];
    return LoginController;
});


