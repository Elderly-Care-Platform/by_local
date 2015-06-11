byControllers.controller('LoginController', ['$scope', '$rootScope', '$http', '$location', '$rootScope',
    function ($scope, $rootScope, $http, $location, $rootScope) {
        $scope.signupViews = {};
        $scope.signupViews.leftPanel = "views/signup/signUpLeftPanel.html";
        $scope.signupViews.contentPanel = "views/signup/login.html";

        $scope.user = {};
        $scope.user.email = '';
        $scope.user.password = '';
        $scope.loginUser = function (user) {
            $scope.resetError();
            $http.post(apiPrefix + 'api/v1/users/login', user).success(function (login) {
                if (login.sessionId === null) {
                    $scope.setError(login.status);
                    return;
                }
                $scope.user.email = '';
                $scope.user.password = '';
                $rootScope.sessionId = login.sessionId;
                $rootScope.bc_discussType = 'A';
                $rootScope.bc_username = login.userName;
                $rootScope.bc_userId = login.id;


                if ("localStorage" in window) {
                    localStorage.setItem("SessionId", login.sessionId);
                    localStorage.setItem("USER_ID", login.id);
                    localStorage.setItem("USER_NAME", login.userName);
                    $location.path("/users/home");
                    var element = document.getElementById("login_placeholder");
                    element.innerHTML = "Logout";
                    element.href = apiPrefix + "#/users/logout/" + login.sessionId;

                    var pro = document.getElementById('profile_placeholder');
                    pro.innerHTML = "Profile";
                    pro.href = apiPrefix + "#/userprofile";

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
            $rootScope.SessionId = '';
        }
        
}]);