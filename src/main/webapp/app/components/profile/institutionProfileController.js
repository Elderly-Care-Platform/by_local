//DIscuss All
byControllers.controller('InstitutionProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams',
    'UserProfile', '$sce',
    function ($scope, $rootScope, $location, $route, $routeParams, UserProfile, $sce) {
        console.log($routeParams);
        $("#preloader").show();
        $scope.userId = $routeParams.profileId;

        $scope.institutionProfile = UserProfile.get({userId:$scope.userId}, function (profile) {
                $scope.institutionProfile = profile.data;
                $("#preloader").hide();
            },
            function (error) {
                console.log("institution profile error");
            });


        $scope.slideGallery = function(dir){
            if(dir==="r"){
                $('.by-gallery-container').addClass('by-gallery-animate-right');
            }else{
                $('.by-gallery-container').removeClass('by-gallery-animate-right');
            }

        }

    }]);
