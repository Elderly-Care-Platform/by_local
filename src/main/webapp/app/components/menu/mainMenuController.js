/**
 * Created by sanjukta on 08-07-2015.
 */
byControllers.controller('MainMenuController', ['$scope', '$rootScope', '$http', '$location', '$routeParams','BYMenu',
    function ($scope, $rootScope, $http, $location, $routeParams, BYMenu) {
        var categoryId = "", discussCategoryLevel = 0;

        $scope.mainMenu = window.by_menu;
        $rootScope.menuCategoryMap = {};
        $rootScope.menuCategoryMapByName = {};
        $rootScope.discussCategoryMap = {};
        $rootScope.serviceCategoryMap = {};

        //$scope.mainMenu = BYMenu.query({}, function(response){
        //    $scope.mainMenu = response;
        //
        //
        //
        //    console.log($rootScope.discussCategoryMap);
        //
        //}, function(error){
        //
        //})

        $scope.createMenuCategoryMap = function(categories){
            angular.forEach(categories, function(category, index){
                $rootScope.menuCategoryMap[category.id] = category;
                $rootScope.menuCategoryMapByName[category.displayMenuName] = category;
                if(category.module === 0){
                    if(!category.parentMenuId){
                        $rootScope.discussCategoryMap[category.id] = category;
                    } else if(category.parentMenuId){
                        //If menu does not exist in map
                        if(!$rootScope.discussCategoryMap[category.id]){
                            var parentMenu = $rootScope.menuCategoryMap[category.parentMenuId], rootMenu;
                            $rootScope.discussCategoryMap[parentMenu.id] = parentMenu;  //Add parent in map

                            if(parentMenu.parentMenuId){
                                rootMenu = $rootScope.menuCategoryMap[parentMenu.parentMenuId];
                                delete $rootScope.discussCategoryMap[rootMenu.id]; //Delete root from map
                                for(var i=0; i < rootMenu.children.length; i++){
                                    var menu = rootMenu.children[i];
                                    if(menu.module === 0){
                                        $rootScope.discussCategoryMap[menu.id] = menu;   //Add parent sibling of same module id in map
                                    }
                                }
                            }
                        }
                    }
                }else if(category.module === 1){  //Services Menus
                    //If it is child category then adding first ancestor of the category in the map, if the category is of service module
                    if(category.ancestorIds.length > 0){
                        $rootScope.serviceCategoryMap[category.ancestorIds[0]] = $rootScope.menuCategoryMap[category.ancestorIds[0]];
                    } else{
                        $rootScope.serviceCategoryMap[category.id] = category;
                    }
                }else{
                    //yet to decide
                }

                if(category.children.length > 0){
                    $scope.createMenuCategoryMap(category.children);
                }
            });

        };


        $scope.selectMenu = function(menu){
            //$(".selected-dropdown").removeClass("selected-dropdown");
            //$("#" + menu.id).parents(".dropdown").addClass("selected-dropdown");
            if(menu.module===0){
                $location.path("/discuss/list/"+menu.slug+"/"+menu.id+"/all/");
            }else if(menu.module===1){
                $location.path("/services/list/"+menu.slug+"/"+menu.id+"/all/");
            }else{
                $location.path("/discuss/list/"+menu.slug+"/"+menu.id+"/all/");
            }

        };


        $scope.createMenuCategoryMap($scope.mainMenu);
        window.by_menu = null;
        delete window.by_menu;

    }]);