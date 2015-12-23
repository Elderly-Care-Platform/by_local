define(['byApp', 'registrationConfig'], function (byApp, registrationConfig) {

    /* @ngInject */
    function UserValidation($rootScope, $location, $http, $q, SessionIdService) {
        return {
            getUserSessionType  : getUserSessionType,
            loginUser           : loginUser,
            logoutUser          : logoutUser,
            validateSession     : validateSession,
            registerUser        : registerUser
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

            if(user.email && user.email.trim().length > 0){
                $http.post(apiPrefix + 'api/v1/users/login', user).success(function (loginData) {
                    var loginData = loginData.data;
                    setUserCredential(loginData);
                    $rootScope.$broadcast('byUserLogin', loginData);
                    deferred.resolve();
                }).error(function (error) {
                    deferred.reject(error.error.errorMsg);
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
            }
            else {
                $scope.setError('Browser does not support cookies');
                $location.path("/users/login");
            }

        };


        function logoutUser(){
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
            localStorage.removeItem("by_cust_id");
            localStorage.removeItem('pendingReviewByUser');
        }

        function validateSession(){
            var deferred = $q.defer();
            $http.defaults.headers.common.sess = localStorage.getItem("SessionId");
            $http.get("api/v1/users/validateSession").success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                invalidateSession();
                deferred.reject(error.error);
            });

            return deferred.promise;
        }

    }

    byApp.registerService('UserValidation', UserValidation);
    return UserValidation;
});
