byControllers.controller('modifySignUpCtrl', ['$scope', '$rootScope', '$http', 'SessionIdService',
    function ($scope, $rootScope, $http, SessionIdService) {
        $scope.userCredential = {};
        $scope.userCredential.userName = localStorage.getItem("USER_NAME");
        $scope.userCredential.password = "";
        $scope.successMsg = null;

        $scope.modifyUserCredential = function(){
            var newUserCredential = {
                "id" : $scope.$parent.userId
            }

            if(!$scope.userCredential.userName && !$scope.userCredential.password){
                $scope.userCredential.signUpErorr = "Username/Password can not be left empty";
            } else if($scope.userCredential.password && $scope.userCredential.password.trim().length < 6){
                $scope.userCredential.signUpErorr = "Password must be at least 6 character";
            }else{
                $scope.userCredential.signUpErorr = "";
            }

            if($scope.userCredential.signUpErorr===""){
                newUserCredential.userName = $scope.userCredential.userName;
                if($scope.userCredential.password && $scope.userCredential.password.trim().length > 0){
                    newUserCredential.password = $scope.userCredential.password;
                }

                $http.post(apiPrefix +'api/v1/users/', newUserCredential)
                    .success(function (response) {
                        $scope.successMsg = "Username/Pwd successfully modified"
                        $scope.setUserCredential(response.data);
                    }).error(function (error) {
                        console.log(error);
                    });
            }

        };

        $scope.setUserCredential = function(login){
            if ("localStorage" in window) {
                SessionIdService.setSessionId(login.sessionId);
                $http.defaults.headers.common.sess = login.sessionId;
                localStorage.setItem("USER_ID", login.userId);
                localStorage.setItem("USER_NAME", login.userName);

                var pro = document.getElementById('profile_placeholder');
                pro.innerHTML = BY.validateUserName(login.userName);
            }
            else {
                $scope.setError('Browser does not support cookies');
                $location.path("/users/login");
            }
        };

        $scope.exit = function(){
            $scope.$parent.exit();
        };

    }]
)