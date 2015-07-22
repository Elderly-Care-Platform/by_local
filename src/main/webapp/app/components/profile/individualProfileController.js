//DIscuss All
byControllers.controller('IndividualProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams',
    function ($scope, $rootScope, $location, $route, $routeParams) {
        $scope.individualProfile = $scope.$parent.profileData;
        $scope.gender =  BY.config.profile.userGender[$scope.individualProfile.individualInfo.sex];

        $scope.slideGallery = function(dir){
            if(dir==="r"){
                $('.by-gallery-container').addClass('by-gallery-animate-right');
            }else{
                $('.by-gallery-container').removeClass('by-gallery-animate-right');
            }

        }

    }]);
