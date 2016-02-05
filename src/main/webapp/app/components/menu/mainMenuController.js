/**
 * Created by sanjukta on 08-07-2015.
 */
define(['bySeoConfig'], function(bySeoConfig) {
    'use strict';
    function MainMenuController($scope, $rootScope, $location, $routeParams, BYMenu, $window) {
        $scope.mainMenu = window.by_menu;
        $rootScope.mainMenu = $scope.mainMenu;
        $rootScope.menuCategoryMap = {};
        $rootScope.menuCategoryMapByName = {};
        $rootScope.discussCategoryMap = {};
        $rootScope.serviceCategoryMap = {};
        $rootScope.hiddenMenu = {};
        $rootScope.windowWidth;

        var initialize = init();

        function createMenuCategoryMap(categories){
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
                    createMenuCategoryMap(category.children);
                }
            });       

        };


        function mergeProdCategories(prod_categories){
            function editCategoryOptions(categories, ancestorIdArr){
                angular.forEach(categories, function(category, index){
                    $rootScope.menuCategoryMap[category.id] = category;
                    category.displayMenuName = category.name.replace(/\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                    category.slug = category.urlKey;
                    category.module = 3;
                    category.ancestorIds = ancestorIdArr;
                    if(category.subcategories){
                        var newAncestorArr = ancestorIdArr.slice();
                        newAncestorArr.push(category.id.toString())
                        category.children = category.subcategories;
                        editCategoryOptions(category.children, newAncestorArr);

                    }else{
                        category.children = [];
                    }

                })
            }

            editCategoryOptions(prod_categories.category, [$rootScope.menuCategoryMapByName["Shop"].id]);
            angular.forEach($scope.mainMenu, function(menu, index){
                if(menu.module==3){
                    menu.children = menu.children.concat(prod_categories.category);
                }
            })
        };

        function init(){
            removeHiddenMenu($scope.mainMenu);
            createMenuCategoryMap($scope.mainMenu);
            if(window.by_prodCategories){
                mergeProdCategories(window.by_prodCategories);
                delete window.by_prodCategories;
            }
            window.by_menu = null;
            delete window.by_menu;
        }



        function removeHiddenMenu(menuList){
            angular.forEach(menuList, function(menu, index){
                if(menu.hidden){
                    menuList.splice(index,1);
                    $rootScope.hiddenMenu[menu.id] = menu;
                }else{
                    if(menu.children.length > 0){
                        removeHiddenMenu(menu.children);
                    }
                }
            })
        }

        //callback from window resize directive
        $scope.windowResize = function(height, width){
            var browserScrollBarWidth = 8; //Specified in psc.css, webkit-scrollbar width 8 px
            $rootScope.windowWidth = width;
        };
    }

    MainMenuController.$inject=['$scope', '$rootScope', '$location', '$routeParams','BYMenu', '$window'];
    return MainMenuController;
});
