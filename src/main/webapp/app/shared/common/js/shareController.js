byControllers.controller('ShareController', ['$scope', '$rootScope', '$location','ValidateUserCredential',
    function ($scope, $rootScope, $location, ValidateUserCredential) {
        $scope.shareNumber = 0;
        $scope.shareComment = function(sharedObj, $event){
        	$event.stopPropagation();
            if(sharedObj){
                var caption = sharedObj.title ? sharedObj.title: "BeautifulYears",
                    picture = sharedObj.articlePhotoFilename ? sharedObj.articlePhotoFilename.thumbnailImage: "",
                    description = sharedObj.text ? $(sharedObj.text).text() : "";

                if(picture && picture!==""){
                    picture = picture.substr(1);
                    picture = window.location.origin + window.location.pathname + picture;

                }

                FB.ui({
                    method: 'feed',
                    link: window.location.origin + "/#/discuss/"+sharedObj.id,
                    picture: picture,
                    caption: "Beautiful Years",
                    description: description,
                    name:caption
                }, function(response){
                    console.log(response);
                    if (response && response.post_id) {
                        $scope.shareNumber++;
                        console.log('Post was published.');
                    } else {
                        console.log('Post was not published.');
                    }
                });
            }
        }
    }]);