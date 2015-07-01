/**
 * Created by sanjukta on 01-07-2015.
 */
byControllers.controller('contactUsController', ['$scope', '$routeParams', '$location', 'Discuss','$route',
    function($scope, $routeParams, $location, Discuss, $route) {
        $scope.editor = {};
        $scope.editor.articlePhotoFilename = "";
        $scope.error = "";

        $scope.editor.userId = localStorage.getItem("USER_ID");
        $scope.editor.username = localStorage.getItem("USER_NAME");



        $scope.editor.subjectOptions = {'0':"FEEDBACK", '1':"SUGGESTION", '2':"READY TO HELP ", '3':"DOING BUSINESS TOGETHER", '4':"WOULD LIKE TO INFORM YOU"};
        $scope.editor.subject = $routeParams.subject ? $scope.editor.subjectOptions[$routeParams.subject]:"";

        $scope.postContent = function (discussType) {
            $scope.discuss = new Discuss();

            $scope.discuss.discussType = discussType;
            $scope.discuss.text = tinyMCE.activeEditor.getContent();
            $scope.discuss.title = $scope.editor.subject;


            //putting the userId to discuss being created
            $scope.discuss.userId = $scope.editor.userId;
            $scope.discuss.username = $scope.editor.username;

            if($scope.discuss.userId.length > 0 && $scope.discuss.text.length > 0){
                $scope.error = "";
                $scope.discuss.$save(function (discuss, headers) {
                    $location.path("/users/home");
                });

            }else{
                $scope.error = "Please fill all details";
            }
        }

    }]);