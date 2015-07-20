//DIscuss All
byControllers.controller('ProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams',
    function ($scope, $rootScope, $location, $route, $routeParams) {

        $scope.profileViews = {};
        $scope.profileType = $routeParams.profileType;
        $scope.profileId = $routeParams.profileId;

        //if($scope.profileType===0){

        //  //  $scope.profileViews.contentPanel = "app/components/profile/institutionProfile.html?versionTimeStamp=%PROJECT_VERSION%";
        //    $scope.profileViews.contentPanel = "app/components/profile/individualProfile.html?versionTimeStamp=%PROJECT_VERSION%";
        //}
        $scope.profileViews.leftPanel = "app/components/profile/profileLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.profileViews.contentPanel = BY.userType[$scope.profileType].contentPanel;
    }]);
