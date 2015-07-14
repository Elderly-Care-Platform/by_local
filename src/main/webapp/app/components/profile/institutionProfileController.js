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

    }]);
