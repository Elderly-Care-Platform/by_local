/**
 * Created by sanjukta on 08-07-2015.
 */
byControllers.controller('MainMenuController', ['$scope', '$rootScope', '$location', '$routeParams','BYMenu','broadCastMenuDetail','$window',
    function ($scope, $rootScope, $location, $routeParams, BYMenu, broadCastMenuDetail, $window) {
        var categoryId = "", discussCategoryLevel = 0;

        $scope.mainMenu = window.by_menu;
        $rootScope.menuCategoryMap = {};
        $rootScope.menuCategoryMapByName = {};
        $rootScope.discussCategoryMap = {};
        $rootScope.serviceCategoryMap = {};
        var menuWidth, submenuHeight;
        $scope.discussMenuCnt = 0;


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
            //$scope.selectedMenu = menu.children;
            if(menu.module===0){
                $location.path("/discuss/list/"+menu.slug+"/"+menu.id+"/all/");
            }else if(menu.module===1){
                $location.path("/services/list/"+menu.slug+"/"+menu.id+"/all/");
            }else{
                $location.path("/discuss/list/"+menu.slug+"/"+menu.id+"/all/");
            }

            if(menu.ancestorIds.length >= 2){
                $scope.selectedTopMenu = null;
            }
        };

        $scope.showHbMenu = function(){
            if(menuWidth < 984){
                $(".by-left-menu").css("display","none");
            }else{
                $(".by-hb-menu").css("display","none");
            }

            if(menuWidth < 984){
                $(".hbMenu").attr("data-toggle", "collapse");
                $(".hbMenu").attr("data-target", ".navbar-responsive-collapse");

                $(".hb-anchorTag").attr("data-toggle", "collapse");
                $(".hb-anchorTag").attr("data-target", ".navbar-responsive-collapse");
            } else{
                $(".hbMenu").removeAttr("data-toggle");
                $(".hbMenu").removeAttr("data-target");

                $(".hb-anchorTag").removeAttr("data-toggle");
                $(".hb-anchorTag").removeAttr("data-target");
            }
        };

        $scope.resize = function(height, width){
            console.log(width);
            menuWidth = width;
            if($scope.sectionHeader){
                if(menuWidth > 730){
                    $(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImage +')');
                } else{
                    $(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImageMobile +')');
                }
            }

            $scope.showHbMenu();
        };

        $scope.subMenuResize = function(height, width){
            submenuHeight = $(".by-left-menu").height();
            resizeLeftMenu();
            $(".by-leafMenu").css('min-height', submenuHeight - 21);
        };

        var resizeLeftMenu = function(){
            var sliderHeight = $(".by_section_header").height();
            submenuHeight = $(".by-left-menu").height();
            if (submenuHeight > 0) {
                var marginTop = submenuHeight - sliderHeight + 13;
                $(".by_left_panel_fixed").css('margin-top', marginTop + 'px');
            }
            if(menuWidth > 991){
            var leftFixMenuHeight = window.innerHeight - $(".header").height()   - submenuHeight  - 10;
            $(".by_left_panel_fixed .scrollableLeftPanelDiv").css('height', leftFixMenuHeight);
        }
           
        };

        $scope.createMenuCategoryMap($scope.mainMenu);
        window.by_menu = null;
        delete window.by_menu;

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
                    }

                    if($scope.sectionHeader[menuName]){
                        $scope.sectionHeader = $scope.sectionHeader[menuName];
                    }
                }

                if($scope.sectionHeader){
                    $(".by_section_header_title").text($scope.sectionHeader.sectionHead);
                    $(".by_section_header_desc").text($scope.sectionHeader.sectionDesc);
                    if(menuWidth > 730){
                        $(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImage +')');
                    } else{
                        $(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImageMobile +')');
                    }
                }
            }
        };

        $scope.$on('handleBroadcastMenu', function () {
            $("#mask").css("display", "none");
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
                    //$scope.selectedTopMenu = $rootScope.menuCategoryMap[menu.ancestorIds[0]];
                    //$scope.selectedSubMenu = menu;
                    if(menu.ancestorIds.length >= 2){
                        subMenu = $rootScope.menuCategoryMap[menu.ancestorIds[1]];
                        //$scope.selectedSubMenu = $rootScope.menuCategoryMap[menu.ancestorIds[1]];
                    }
                }else{
                    topMenu = menu;
                    //$scope.selectedTopMenu = menu;
                }

                //Menu should not be reset, if same menu id is selected as it create problem in iPad
                if(topMenu && (!$scope.selectedTopMenu || topMenu.id!==$scope.selectedTopMenu.id)){
                    $scope.selectedTopMenu = topMenu;
                }

                //Menu should not be reset, if same menu id is selected as it create problem in iPad
                if(subMenu && (!$scope.selectedSubMenu || subMenu.id!==$scope.selectedSubMenu.id)){
                    $scope.selectedSubMenu = subMenu;
                }

                //Find number of discuss module menu, to show separator line in UI
                if($scope.selectedTopMenu.children && $scope.selectedTopMenu.children.length > 0){
                    angular.forEach($scope.selectedTopMenu.children, function(menu, index){
                        if(menu.module==0){
                            $scope.discussMenuCnt++;
                        }
                    })
                }

                //Add selected css for top level menu
                $(".selected-dropdown").removeClass("selected-dropdown");
                $("#" + $scope.selectedTopMenu.id).parents(".by-menu").addClass("selected-dropdown");

                if($scope.selectedTopMenu && $scope.selectedTopMenu.children && $scope.selectedTopMenu.children.length == 0){
                    $(".by_left_panel_fixed").addClass("by_left_panel_homeSlider_position");
                    $(".by_left_panel_fixed").addClass('by_left_panel_homeSlider');
                    //$(".by_left_panel_fixed").css('margin-top', '0px');
                }else{
                    $(".by_left_panel_fixed").removeClass('by_left_panel_homeSlider');
                }

                $(".by-subMenu" ).hover(
                    function() {
                        //console.log($(this).find(".by-leafMenu li").length);
                        if($(this).find(".by-leafMenu li").length > 0){
                            $("#mask").css("display", "block");
                        }

                    }, function() {
                        $("#mask").css("display", "none");
                    }
                );
                resizeLeftMenu();
            }else{
                $(".selected-dropdown").removeClass("selected-dropdown");
                $scope.selectedTopMenu = null;
            }
        });



        angular.element($window).bind("scroll", function() {
            if($(".homeSlider").length > 0){
                if($(".homeSlider")[0].style.display !== "none"){
                   $(".by_left_panel_fixed").addClass('by_left_panel_homeSlider');
                }

                $scope.sliderHeight = $(".homeSlider").height();
                if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= $scope.sliderHeight){
                    $(".by_left_panel_fixed").removeClass('by_left_panel_homeSlider');
                    $(".by_left_panel_fixed").css('margin-top', -$scope.sliderHeight+'px');
                }else{
                    $(".by_left_panel_fixed").addClass('by_left_panel_homeSlider');
                    $(".by_left_panel_fixed").css('margin-top', '0px');
                }

                if($(".homeSlider")[0].style.display == "none"){
                    $(".by_left_panel_fixed").removeClass('by_left_panel_homeSlider');
                    $(".by_left_panel_fixed").css('margin-top', '0px');
                }

//                console.log($(".homeSlider")[0].style.display);
            }else{
                if($scope.selectedTopMenu && $scope.selectedTopMenu.children && $scope.selectedTopMenu.children.length == 0){
                    console.log("comes inside");
                    $scope.sliderHeight = $(".by_section_header").height();
                    if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= $scope.sliderHeight){
                        console.log("margin nottttttt 0");
                        $(".by_left_panel_fixed").removeClass('by_left_panel_homeSlider');
                        $(".by_left_panel_fixed").css('margin-top', -$scope.sliderHeight+'px');
                    }else{
                        console.log("margin 0");
                        $(".by_left_panel_fixed").addClass('by_left_panel_homeSlider');
                        $(".by_left_panel_fixed").css('margin-top', '0px');
                    }
                }
            }

        });

    }]);