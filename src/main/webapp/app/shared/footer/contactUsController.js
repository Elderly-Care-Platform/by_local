/**
 * Created by sanjukta on 01-07-2015.
 */
byControllers.controller('contactUsController', ['$scope', '$routeParams', '$location', 'ContactUs','$route',
    function($scope, $routeParams, $location, ContactUs, $route) {
        $scope.isLoggedIn = false;
        $scope.userEmail ='';
        $scope.username = '';
        $scope.errorMsg = "";

        if(localStorage.getItem("USER_ID")){
            $scope.isLoggedIn = true;
            $scope.userEmail = localStorage.getItem("USER_ID");
            $scope.username = localStorage.getItem("USER_NAME");
        }

        $scope.subjectOptionsMap = {'0':"FEEDBACK", '1':"SUGGESTION", '2':"READY TO HELP ", '3':"DOING BUSINESS TOGETHER", '4':"WOULD LIKE TO INFORM YOU"};
        $scope.subjectTitle = $routeParams.subject ? $scope.subjectOptionsMap[$routeParams.subject]:"";

        $scope.postContent = function (discussType) {
            $scope.contactUs = new ContactUs();

            $scope.contactUs.discussType = discussType;
            $scope.contactUs.text = tinyMCE.activeEditor.getContent();
            $scope.contactUs.title = $scope.subjectTitle;
            
            $scope.contactUs.userId = $scope.userEmail;
            $scope.contactUs.username = $scope.username;

            if($scope.contactUs.userId.length > 0 && $scope.contactUs.text.length > 0 && $scope.contactUs.username.length > 0){
                $scope.errorMsg = "";
                $scope.contactUs.$save(function (contactUs, headers) {
                    $location.path("/users/home");
                });

            }else{
                $scope.errorMsg = "Please fill all details";
            }
        }

    }]);