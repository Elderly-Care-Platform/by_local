byControllers.controller('BYAboutUsController', ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', 'HomeFeaturedContent', 'Discuss','$sce',
    function ($scope, $rootScope, $routeParams, $timeout, $location, HomeFeaturedContent, Discuss,$sce) {
        $scope.editor = {};
        $scope.error = "";
        $scope.editor.subject = "";
        $scope.editor.articlePhotoFilename = "";
        $scope.currentAcceleratorSelected = "";
        $scope.currentView = "aboutUs";

        $scope.$watch("articles", function (value) {
            $timeout(
                function () {
                    $scope.scroll($scope.currentAcceleratorSelected)
                }, 100);
        });
        $scope.aboutUsViews = {};
        $scope.aboutUsViews.contentPanel = "app/components/aboutUs/aboutUsContentPanel.html";


        $scope.add = function (type) {
            if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
            {
                $rootScope.nextLocation = $location.path();
                $location.path('/users/login');
            }
            else
            {
                $scope.error = "";
                $scope.currentView = "editor";
                $scope.aboutUsViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html";
                window.scrollTo(0, 0);
            }
        }

        $scope.register = function (discussType) {
            $scope.discuss = new Discuss();
            $scope.discuss.discussType = discussType;
            $scope.discuss.text = tinyMCE.activeEditor.getContent();
            $scope.discuss.title = $scope.editor.subject;
            $scope.discuss.articlePhotoFilename = $scope.editor.articlePhotoFilename;
            $scope.discuss.topicId = BY.editorCategoryList.getCategoryList();
            //putting the userId to discuss being created
            $scope.discuss.userId = localStorage.getItem("USER_ID");
            $scope.discuss.username = localStorage.getItem("USER_NAME");

            if($scope.discuss.discussType==="F"){
                if($scope.discuss.title.trim().length > 0){
                    $scope.submitContent();
                }else {
                    $scope.error = "Please select title";
                }


            } else if($scope.discuss.discussType==="A"){
                if($scope.discuss.topicId.length > 0 && $scope.discuss.title.trim().length > 0){
                    $scope.submitContent();
                }else{
                    if($scope.discuss.title.trim().length <= 0){
                        $scope.error = "Please select title";
                    }else if($scope.discuss.topicId.length <= 0){
                        $scope.error = "Please select at least one category where your story would appear";
                    }
                }

            } else if($scope.discuss.discussType==="Q" || $scope.discuss.discussType==="P"){
                if($scope.discuss.topicId.length > 0 && $scope.discuss.text.trim().length > 0){
                    $scope.submitContent();
                }else{
                    if($scope.discuss.text.trim().length <= 0){
                        $scope.error = "Please add more details";
                    }else if($scope.discuss.topicId.length <= 0){
                        if($scope.discuss.discussType==="Q")
                            $scope.error = "Please select at least one category where your question would appear";
                        if($scope.discuss.discussType==="P")
                            $scope.error = "Please select at least one category where your post would appear";
                    }
                }
            } else {
                //no more type
            }
        };

        $scope.submitContent = function(){
            $scope.error = "";
            $scope.discuss.$save(function (discuss, headers) {
                $scope.editor.subject = "";
                BY.editorCategoryList.resetCategoryList();
                $scope.aboutUsViews.contentPanel = "app/components/aboutUs/aboutUsContentPanel.html";
            });
        };

        $scope.accelerate = function (id) {
            $scope.currentAcceleratorSelected = id;
            if($scope.currentView === "editor"){
                $scope.aboutUsViews.contentPanel = "app/components/aboutUs/aboutUsContentPanel.html";
                $timeout(
                    function () {
                        $scope.scroll($scope.currentAcceleratorSelected);
                    }, 100);
            }else{
                $scope.scroll($scope.currentAcceleratorSelected);
            }

        }

        $scope.scroll = function(id){
            if(id){
                var tag = $("#" + id + ":visible");
                if(tag.length > 0){
                    $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, 'slow');
                }
            }else{
                window.scrollTo(0, 0);
            }
        }




    }]);