/**
 * Created by sanjukta on 25-06-2015.
 */
byControllers.controller('discussDetailLeftController', ['$scope', '$rootScope', '$routeParams', 'UserDiscussList','broadCastData',
    function ($scope, $rootScope, $routeParams, UserDiscussList, broadCastData) {
        var discussId = $routeParams.discussId;

        $scope.$on('handleBroadcast', function() {
            if(discussId === broadCastData.newData.id){
                $scope.discuss = broadCastData.newData;
            }

        });


    }]);