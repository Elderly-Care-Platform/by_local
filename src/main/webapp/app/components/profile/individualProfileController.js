//DIscuss All
byControllers.controller('IndividualProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams',
    'UserProfile', '$sce',
    function ($scope, $rootScope, $location, $route, $routeParams, UserProfile, $sce) {
        $("#preloader").show();
        $scope.userId = $routeParams.profileId;
        var genderOption = {0:'Ms.', 1:'Mr.'};
        

        $scope.individualProfile = UserProfile.get({userId:$scope.userId}, function (profile) {
                $scope.individualProfile = profile.data;
                $("#preloader").hide();
                profile.data.individualInfo.sex =  genderOption[profile.data.individualInfo.sex];
                //console.log(profile.data.individualInfo.sex);
            },
            function (error) {
                console.log("individual profile error");
            });


        $scope.slideGallery = function(dir){
            if(dir==="r"){
                $('.by-gallery-container').addClass('by-gallery-animate-right');
            }else{
                $('.by-gallery-container').removeClass('by-gallery-animate-right');
            }

        }

    }]);
