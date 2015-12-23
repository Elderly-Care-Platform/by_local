define(['byApp'], function (byApp) {

    /* @ngInject */
    function UserValidation($rootScope, $location, $http, $q, SessionIdService) {
        return {
            getUserSessionType  : getUserSessionType,
            loginUser           : loginUser,
            logoutUser          : logoutUser,
            validateSession     : validateSession
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
            var user = {};
            user.email = email;
            if(pwd){
                user.password = pwd;
            }
            var deferred = $q.defer();
            $http.post(apiPrefix + 'api/v1/users/login', user).success(function (loginData) {
                var loginData = loginData.data;
                setUserCredential(loginData);
                $rootScope.$broadcast('byUserLogin', loginData);
                deferred.resolve();
            }).error(function (error) {
                deferred.reject(error);
            });

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
