//DIscuss All
byControllers.controller('InstitutionProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams',
    function ($scope, $rootScope, $location, $route, $routeParams, $sce) {
        $scope.institutionProfile = $scope.$parent.profileData;

        $scope.slideGallery = function(dir){
            if(dir==="r"){
                $('.by-gallery-container').addClass('by-gallery-animate-right');
            }else{
                $('.by-gallery-container').removeClass('by-gallery-animate-right');
            }
        }

    }]);
