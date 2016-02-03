define(['byApp', 'registrationConfig'], function (byApp, registrationConfig) {

    function UserValidation($rootScope, $location, $http, $q, SessionIdService) {
        return {
            getUserSessionType  : getUserSessionType,
            loginUser           : loginUser,
            logoutUser          : logoutUser,
            validateSession     : validateSession,
            registerUser        : registerUser,
            googleLogin         : googleLogin,
            fbLogin             : fbLogin
        };



        function getUserSessionType(){
            var sessionId = SessionIdService.getSessionId(), sessionType = localStorage.getItem("SESSION_TYPE");
            if(sessionId && sessionId!="null" && sessionType){
                return sessionType;
            } else{
                return null;
            }
        };

        function loginUser(email, pwd){
            var user = {}, deferred = $q.defer();
            user.email = email;
            if(pwd){
                user.password = pwd;
            }
            var isMobile = !isNaN(parseFloat(email)) && isFinite(email);
            if (isMobile){
                user.userIdType = BY.config.regConfig.userIdType.mobile;
                user.phoneNumber = email;
                delete user.email;
            } else{
                user.userIdType = BY.config.regConfig.userIdType.email;
                user.email = email;
                delete user.phoneNumber;
            }
            if((user.email && user.email.trim().length > 0) || (user.phoneNumber && user.phoneNumber.trim().length > 0)){
                $http.post(apiPrefix + 'api/v1/users/login', user).success(function (loginData) {
                    var loginData = loginData.data;
                    setUserCredential(loginData);
                    $rootScope.$broadcast('byUserLogin', loginData);
                    deferred.resolve();
                }).error(function (error) {
                    var errorMsg = "";
                    if(BY.config.userCredentialError[error.error.errorCode]){
                        errorMsg = BY.config.userCredentialError[error.error.errorCode];
                    }else if(error.error && error.error.errorMsg){
                        errorMsg = error.error.errorMsg;
                    } else{
                        errorMsg = "Invalid user";
                    }
                    deferred.reject(errorMsg);
                });
            } else{
                deferred.reject("Please enter email Id");
            }

            return deferred.promise;
        }

        function registerUser(userObj){
            var deferred = $q.defer(), errMsg = "", newUser = {'userName':userObj.userName};
            if(!userObj.uniqueRegId){
                errMsg = "Please enter a valid email-id";
            } else {
                var regId = userObj.uniqueRegId;
                var isMobile = !isNaN(parseFloat(userObj.uniqueRegId)) && isFinite(userObj.uniqueRegId);
                if(isMobile == true)
                {
                    var reg = /^\d+$/;
                    if (regId.length === 10 && reg.test(regId)) {
                        errMsg = "";
                        newUser.userIdType = BY.config.regConfig.userIdType.mobile;
                        newUser.phoneNumber = regId;
                        delete newUser.email;

                    } else {
                        errMsg = "Please enter 10 digit mobile number";
                    }

                } else {
                    var emailValidation = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if(!emailValidation.test(regId)){
                        errMsg = "Please enter valid Email Id";
                    }else{
                        errMsg = "";
                        newUser.userIdType = BY.config.regConfig.userIdType.email;
                        newUser.email = regId;
                        delete newUser.phoneNumber;
                    }
                }
            }

            if(errMsg.trim().length === 0){
                if(!userObj.pwd || userObj.pwd.trim().length < 6){
                    errMsg = "Password must be at least 6 character";
                }else{
                    newUser.password = userObj.pwd;
                    errMsg = "";
                }
            }


            if(errMsg.trim().length > 0){
                deferred.reject(errMsg);
            } else{
                $http.post(apiPrefix + 'api/v1/users', newUser).success(function (response) {
                    var regData = response.data;
                    setUserCredential(regData);
                    $rootScope.$broadcast('byUserLogin', regData);
                    deferred.resolve();
                }).error(function (error) {
                    deferred.reject(error.error.errorMsg);
                });
            }

            return deferred.promise;
        }


        function setUserCredential(login){
            if ("localStorage" in window) {
                SessionIdService.setSessionId(login.sessionId);
                $http.defaults.headers.common.sess = login.sessionId;
                localStorage.setItem("USER_ID", login.userId);
                localStorage.setItem("USER_NAME", login.userName);
                localStorage.setItem("SESSION_TYPE", login.sessionType);
                localStorage.setItem("USER_EMAIL", login.userEmail);
                localStorage.setItem("USER_PHONENUMBER", login.phoneNumber);
                localStorage.removeItem("by_cust_id");
            }
            else {
                $scope.setError('Browser does not support cookies');
                $location.path("/users/login");
            }

        };


        function logoutUser(){
            localStorage.removeItem("by_cust_id");
            $http.get(apiPrefix + "api/v1/users/logout");
            invalidateSession();
            $rootScope.$broadcast('byUserLogout', '');
            $location.path("/users/login");
        };


        function invalidateSession(){
            SessionIdService.setSessionId("");
            $http.defaults.headers.common.sess = "";
            localStorage.setItem("SessionId", "");
            localStorage.setItem("USER_ID", "");
            localStorage.setItem("USER_NAME", "");
            localStorage.setItem("SESSION_TYPE", "");
            localStorage.removeItem('pendingReviewByUser');
            localStorage.removeItem("USER_EMAIL");
            localStorage.removeItem("USER_PHONENUMBER");
        }

        function validateSession(){
            var deferred = $q.defer();
            $http.defaults.headers.common.sess = localStorage.getItem("SessionId");
            $http.get(apiPrefix + "api/v1/users/validateSession").success(function (response) {
                setUserCredential(response.data);
                deferred.resolve(response);
            }).error(function (error) {
                invalidateSession();
                deferred.reject(error.error);
            });

            return deferred.promise;
        }

        var socialCallback = function(e){
            socialRegistration(e.data);
            $scope.resetError();
            window.removeEventListener("message", socialCallback, false);
        }


         function googleLogin(){
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

         function fbLogin(){
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

    }

    byApp.registerService('UserValidation', UserValidation);
    return UserValidation;
});
