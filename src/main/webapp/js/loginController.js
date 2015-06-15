byControllers.controller('LoginController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'User',
    function ($scope, $rootScope, $http, $location, $routeParams, User) {
		window.scrollTo(0, 0);
        $scope.signupViews = {};
        $scope.signupViews.leftPanel = "views/signup/signUpLeftPanel.html";
        $scope.signupViews.contentPanel = "views/signup/login.html";

        $scope.user = {};
        $scope.user.email = '';
        $scope.user.password = '';
        $scope.regLevel = 0;
        $scope.setView = function(level){
        	if(level===1){
        		$scope.signupViews.contentPanel = "views/signup/user_i_am.html";
        		$scope.regLevel = 1;
        	}
        }
        
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
                $rootScope.bc_discussType = 'All';
                $rootScope.bc_username = login.userName;
                $rootScope.bc_userId = login.id;
//                $scope.setUserCredential();

                if ("localStorage" in window) {
                    localStorage.setItem("SessionId", login.sessionId);
                    localStorage.setItem("USER_ID", login.id);
                    localStorage.setItem("USER_NAME", login.userName);
                    if($rootScope.nextLocation)
					{
						$location.path($rootScope.nextLocation);
					}
					else
					{
						$location.path("/users/home");
					}
                    document.getElementById("login_placeHolder_li").style.opacity = "1";
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
            $rootScope.SessionId = undefined;
        }

        $scope.setUserCredential = function(userData){
        	 if ("localStorage" in window) {
                 localStorage.setItem("SessionId", login.sessionId);
                 localStorage.setItem("USER_ID", login.id);
                 localStorage.setItem("USER_NAME", login.userName);
                 $location.path("/users/home");
                 document.getElementById("login_placeHolder_li").style.opacity = "1";
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
        }
        
//     ************************   create new user start
        $scope.newUser = new User();
        $scope.createNewUser = function(newUser) {
           
            $scope.newUser.$save(function (login) {
                $scope.createUserSuccess = "User registered successfully";
                $scope.createUserError = '';
//                $scope.setView(1);
                if ("localStorage" in window) {
                    localStorage.setItem("SessionId", login.sessionId);
                    localStorage.setItem("USER_ID", login.id);
                    localStorage.setItem("USER_NAME", login.userName);
                    if($rootScope.nextLocation)
					{
						$location.path($rootScope.nextLocation);
					}
					else
					{
						$location.path("/users/home");
					}
                    document.getElementById("login_placeHolder_li").style.opacity = "1";
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
            }, function (error) {
                // failure
                console.log("$save failed " + JSON.stringify(error));
                $scope.createUserError = 'Email already exists. ';
                $scope.createUserSuccess = '';
                
            });
        }

//      ************************   create new user end

    }]);