/**
 * Created by sanjukta on 08-07-2015.
 */
define(['sectionHeaderConfig'], function(sectionHeaderConfig) {
    'use strict';
    function MainMenuController($scope, $rootScope, $location, $routeParams, BYMenu, broadCastMenuDetail, $window) {
        var categoryId = "", discussCategoryLevel = 0;

        $scope.mainMenu = window.by_menu;
        $rootScope.mainMenu = $scope.mainMenu;
        $rootScope.menuCategoryMap = {};
        $rootScope.menuCategoryMapByName = {};
        $rootScope.discussCategoryMap = {};
        $rootScope.serviceCategoryMap = {};
        var submenuHeight;
        $scope.discussMenuCnt = 0;
        $scope.menuView = "";
        $rootScope.scrollableLeftPanel = false;
        $scope.hamburgerView = false;
        $rootScope.windowWidth;

        var createMenuCategoryMap = function(categories){
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
        

        var mergeProdCategories = function(prod_categories){
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
                    console.log(menu.displayMenuName);
                    menu.children = menu.children.concat(prod_categories.category);
                }
            })
        };

        createMenuCategoryMap($scope.mainMenu);
        mergeProdCategories(window.by_prodCategories);
        window.by_menu = null;
        delete window.by_menu;
        delete window.by_prodCategories;

        //Select menu and show relevant page
        $scope.selectMenu = function(menu){
            //$location.url($location.path());
            //if(menu.module===0){
            //    $location.path("/discuss/list/"+menu.slug+"/"+menu.id+"/all/");
            //}else if(menu.module===1){
            //    $location.path("/services/list/"+menu.slug+"/"+menu.id+"/all/");
            //}else if(menu.module===2){
            //    $location.path("/housing/list/"+menu.slug+"/"+menu.id+"/all/");
            //}else if(menu.module===3){
            //    $location.path("/products/list/"+menu.slug+"/"+menu.id+"/all/");
            //    if(menu.ancestorIds.length > 0){
            //        $location.search('q', JSON.stringify(menu));
            //    }
            //
            //    console.log($location);
            //
            //}else{
            //    $location.path("/discuss/list/"+menu.slug+"/"+menu.id+"/all/");
            //}
            //
            ////Reset top menu, to dismiss hover menu - ipad fix
            //if(menu.ancestorIds && menu.ancestorIds.length >= 2){
            //    $scope.selectedTopMenu = null;
            //}
        };

        //
        $rootScope.setLeftScroll = function(){
            if($rootScope.scrollableLeftPanel){
                $(".by_left_panel_fixed").addClass("by_left_panel_homeSlider_position");
                $(".by_left_panel_fixed").addClass('by_left_panel_homeSlider');
            }else{
                $(".by_left_panel_fixed").removeClass('by_left_panel_homeSlider');
            }
        };


        $scope.bySubMenuInit = function(){
            //Show/hide mask on screen on hover of by submenu
            $(".by-subMenu" ).hover(
                function() {
                    //console.log($(this).find(".by-leafMenu li").length);
                    if($(this).find(".by-leafMenu li").length > 0){
                        $("#mask").css("display", "block");
                    }
                    $scope.subMenuResize();

                }, function() {
                    $("#mask").css("display", "none");
                }
            );
        };

        //Show different section header based on screen size
        var resizeSectionHeader = function(){
            if($scope.sectionHeader){
                if($rootScope.windowWidth > 730){
                    $(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImage +')');
                } else{
                    $(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImageMobile +')');
                }
            }
        };


        //Reset Left panel fix menu top position based on sub menu height
        var resizeLeftMenu = function(){
            var sliderHeight = $(".by_section_header").height();
            submenuHeight = $(".by-left-menu").height();

            //Set the margin top of left panel below menu
            if (submenuHeight > 0) {
                var marginTop = submenuHeight - sliderHeight + 13;
                $(".by_left_panel_fixed").css('margin-top', marginTop + 'px');
            }

            //Set left panel's scrollable height below menu
            if ($rootScope.windowWidth > 991) {
                var leftFixMenuHeight = window.innerHeight - $(".header").height() - $(".footer-v1").height() - submenuHeight - 10;
                $(".by_left_panel_fixed .scrollableLeftPanelDiv").css('height', leftFixMenuHeight);
            }
        };

        //callback from window resize directive
        $scope.windowResize = function(height, width){
            console.log(width);
            var browserScrollBarWidth = 8; //Specified in psc.css, webkit-scrollbar width 8 px
            $rootScope.windowWidth = width;

            if((width + browserScrollBarWidth) > 991){
                $scope.menuView = "app/components/menu/mainMenu.html";
                $scope.hamburgerView = false;
            }else{
                $scope.menuView = "app/components/menu/hamBurgerMenu.html";
                $scope.hamburgerView = true;
            }
            resizeSectionHeader();
            resizeLeftMenu();
            $rootScope.setLeftScroll();
        };


        //BY-Submenu resize callbak from element resize directive
        $scope.subMenuResize = function(height, width){
            submenuHeight = $(".by-left-menu").height();
            resizeLeftMenu();
            $(".by-leafMenu").css('min-height', submenuHeight);
        };


        //BY-Update section header based on selected by menu
        $scope.updateSectionHeader = function(menu){
            if(menu.displayMenuName){
                var menuName = menu.displayMenuName.toLowerCase().trim();
                $scope.sectionHeader = BY.config.sectionHeader[menuName];
                if(!$scope.sectionHeader && menu.ancestorIds.length > 0) {
                    if(menu.ancestorIds.length===1){
                        var rootMenu = $rootScope.menuCategoryMap[menu.ancestorIds[0]];
                        $scope.sectionHeader = BY.config.sectionHeader[rootMenu.displayMenuName.toLowerCase().trim()];
                    } else if (menu.ancestorIds.length===2){
                        var rootMenu = $rootScope.menuCategoryMap[menu.ancestorIds[1]];
                        $scope.sectionHeader = BY.config.sectionHeader[rootMenu.displayMenuName.toLowerCase().trim()];

                        if(!$scope.sectionHeader){
                            rootMenu = $rootScope.menuCategoryMap[rootMenu.ancestorIds[0]];
                            $scope.sectionHeader = BY.config.sectionHeader[rootMenu.displayMenuName.toLowerCase().trim()];
                        }
                    }

                    if($scope.sectionHeader && $scope.sectionHeader[menuName]){
                        $scope.sectionHeader = $scope.sectionHeader[menuName];
                    }
                }

                if($scope.sectionHeader){
                    $(".by_section_header_title").text($scope.sectionHeader.sectionHead);
                    $(".by_section_header_desc").text($scope.sectionHeader.sectionDesc);
                    resizeSectionHeader();
                }
            }
        };


        //Reset all menu css and selection menu style based on selected menu
        var updateMenuStyle = function(){
            $("#mask").css("display", "none");

            //Add selected css for top level menu
            $(".selected-dropdown").removeClass("selected-dropdown");
            if($scope.selectedTopMenu){
                $("#" + $scope.selectedTopMenu.id).parents(".by-menu").addClass("selected-dropdown");
            }

            //Reset scrollableLeftPanel
            if($scope.selectedTopMenu && $scope.selectedTopMenu.children && $scope.selectedTopMenu.children.length > 0){
                $rootScope.scrollableLeftPanel = false;
            }else{
                if($(".homeSlider").length > 0 || $(".by_section_header").length > 0){
                    $rootScope.scrollableLeftPanel = true;
                }else{
                    $rootScope.scrollableLeftPanel = false;
                }
            }

            $rootScope.setLeftScroll();
        };


        //Reset selected Top Menu and sub menu
        $scope.$on('handleBroadcastMenu', function () {
            if (broadCastMenuDetail.selectedMenu && broadCastMenuDetail.selectedMenu!=0) {
                $scope.discussMenuCnt = 0;
                var menu, topMenu, subMenu;

                if(broadCastMenuDetail.selectedMenu.routeParamMenuId) {
                    menu = $rootScope.menuCategoryMap[broadCastMenuDetail.selectedMenu.routeParamMenuId];
                }else{
                    menu = broadCastMenuDetail.selectedMenu
                }

                //update section header for any level till leaf
                $scope.updateSectionHeader(menu);

                //Find the top level menu using ancestorId array
                if(menu.ancestorIds.length > 0){
                    topMenu = $rootScope.menuCategoryMap[menu.ancestorIds[0]];
                    subMenu = menu;
                    if(menu.ancestorIds.length >= 2){
                        subMenu = $rootScope.menuCategoryMap[menu.ancestorIds[1]];
                    }
                }else{
                    topMenu = menu;
                    $scope.selectedSubMenu = null;
                }

                //Menu should not be reset, if same menu id is selected as it create problem in iPad
                if(topMenu && (!$scope.selectedTopMenu || topMenu.id!==$scope.selectedTopMenu.id)){
                    $scope.selectedTopMenu = topMenu;
                }

                //Menu should not be reset, if same menu id is selected as it create problem in iPad
                if(subMenu && (!$scope.selectedSubMenu || subMenu.id!==$scope.selectedSubMenu.id)){
                    $scope.selectedSubMenu = subMenu;
                }

                //Find number of discuss module menu, to show separator line in menu UI between submenus
                if($scope.selectedTopMenu.children && $scope.selectedTopMenu.children.length > 0){
                    angular.forEach($scope.selectedTopMenu.children, function(menu, index){
                        if(menu.module==0){
                            $scope.discussMenuCnt++;
                        }
                    })
                }

            }else{
                $scope.selectedTopMenu = null;
            }

            updateMenuStyle();
            resizeLeftMenu();
        });


        //bind scroll to window and calculate left panel scroll
        angular.element($window).bind("scroll", function() {
            if($rootScope.scrollableLeftPanel && !$scope.hamburgerView){
                var bannerHeight = 0;
                if($(".homeSlider").length > 0){
                    bannerHeight = $(".homeSlider").height();
                }else if($(".by_section_header").length > 0){
                    bannerHeight = $(".by_section_header").height();
                }

                if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= bannerHeight){
                    console.log("margin nottttttt 0");
                    $(".by_left_panel_fixed").removeClass('by_left_panel_homeSlider');
                    $(".by_left_panel_fixed").removeClass("by_left_panel_homeSlider_position");
                    $(".by_left_panel_fixed").css('margin-top', -bannerHeight+'px');
                }else{
                    console.log("margin 0");
                    $(".by_left_panel_fixed").addClass('by_left_panel_homeSlider');
                    $(".by_left_panel_fixed").addClass("by_left_panel_homeSlider_position");
                    $(".by_left_panel_fixed").css('margin-top', '0px');
                }
            }
        });
    }

    MainMenuController.$inject=['$scope', '$rootScope', '$location', '$routeParams','BYMenu','broadCastMenuDetail','$window'];
    return MainMenuController;
});
