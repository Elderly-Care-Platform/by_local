byControllers.controller('ShareController', ['$scope', '$rootScope', '$location','ValidateUserCredential',
    function ($scope, $rootScope, $location, ValidateUserCredential) {
        $scope.shareNumber = 0;
        $scope.shareComment = function(){
            FB.ui({
                method: 'feed',
                link: "http://www.beautifulyears.com/#/discuss/5592886ae4b0af99ac53489a",
                picture: 'http://fbrell.com/f8.jpg',
                caption: 'Reference Documentation',
                description: 'Dialogs provide a simple, consistent interface for'
            }, function(response){
                console.log(response);
                if (response && response.post_id) {
                    $scope.shareNumber++;
                    alert('Post was published.');

                } else {
                    alert('Post was not published.');
                }
            });
        }
    }]);