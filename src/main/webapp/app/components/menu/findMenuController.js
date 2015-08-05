/**
 * Created by sanjukta on 08-07-2015.
 */
byControllers.controller('FindMenuController', ['$scope', '$rootScope', '$http', '$location', '$routeParams','ServiceTypeList',
    function ($scope, $rootScope, $http, $location, $routeParams, ServiceTypeList) {
        $scope.ServiceTypeList = ServiceTypeList.query().$promise.then(
            function(categories){
                $scope.ServiceTypeList = categories;
                $rootScope.findCategoryList = categories;
                $rootScope.findCategoryListMap = {};
                $rootScope.findCategoryNameIdMap = {};

                $scope.createFindCategoryMap(categories);

            }
        );

        $scope.createFindCategoryMap = function(categories){
            angular.forEach(categories, function(category, index){
                $rootScope.findCategoryListMap[category.id] = category;
                $rootScope.findCategoryNameIdMap[category.name.toLowerCase()] = category.id;

                if(category.childCount > 0){
                    $scope.createFindCategoryMap(category.children);
                }
            });
        }

    }]);