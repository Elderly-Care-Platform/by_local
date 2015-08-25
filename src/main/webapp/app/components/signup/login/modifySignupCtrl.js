byControllers.controller('modifySignUpCtrl', ['$scope', '$rootScope', '$http',
    function ($scope, $rootScope, $http) {
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
                $http.post(apiPrefix +'api/v1/userProfile/', newUserCredential)
                    .success(function (response) {
                        console.log(response);
                    }).error(function (error) {
                        console.log(error);
                    });
            }

        }
    }]
)