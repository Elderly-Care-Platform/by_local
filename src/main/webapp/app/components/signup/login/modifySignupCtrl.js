byControllers.controller('modifySignUpCtrl', ['$scope', '$rootScope', '$http', 'SessionIdService',
    function ($scope, $rootScope, $http, SessionIdService) {
        $scope.userName = "";
        $scope.password = "";

        $scope.modifyUserCredential = function(){
            if(!$scope.userName && !$scope.password){
                $scope.signUpErorr = "Username/Password empty";
            } else if($scope.password && $scope.password.trim().length < 6){
                $scope.signUpErorr = "Password must be at least 6 character";
            }else{
                $scope.signUpErorr = "";
            }



            if($scope.signUpErorr===""){
                var newUserCredential = {
                    "id" : $scope.$parent.userId,
                    "userName" : $scope.userName,
                    "password" : $scope.password
                }
                $http.post(apiPrefix +'api/v1/users/', newUserCredential)
                    .success(function (response) {
                        $scope.setUserCredential(response.data);
                    }).error(function (error) {
                        console.log(error);
                    });
            }

        }

        $scope.setUserCredential = function(login){
            if ("localStorage" in window) {
                SessionIdService.setSessionId(login.sessionId);
                $http.defaults.headers.common.sess = login.sessionId;
                localStorage.setItem("USER_ID", login.userId);
                localStorage.setItem("USER_NAME", login.userName);

                var pro = document.getElementById('profile_placeholder');
                pro.innerHTML = BY.validateUserName(login.userName);
                $scope.$parent.exit();
            }
            else {
                $scope.setError('Browser does not support cookies');
                $location.path("/users/login");
            }
        }
    }]
)