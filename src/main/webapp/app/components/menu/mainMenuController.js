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
        var menuWidth;
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
        };

        $scope.showHbMenu = function(){
            if(menuWidth < 984){
                console.log($(".by-left-menu")[0]);
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

        $scope.createMenuCategoryMap($scope.mainMenu);
        window.by_menu = null;
        delete window.by_menu;

        $scope.updateSectionHeader = function(menu){
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
        };

        $scope.$on('handleBroadcastMenu', function () {
            if (broadCastMenuDetail.selectedMenu && broadCastMenuDetail.selectedMenu!=0) {
                $scope.discussMenuCnt = 0;
                var menu = broadCastMenuDetail.selectedMenu;
                if(menu.ancestorIds.length > 0){
                    $scope.selectedTopMenu = $rootScope.menuCategoryMap[menu.ancestorIds[0]];
                    $scope.selectedSubMenu = menu;
                    if(menu.ancestorIds.length >= 2){
                        $scope.selectedSubMenu = $rootScope.menuCategoryMap[menu.ancestorIds[1]];
                    }

                }else{
                    $scope.selectedTopMenu = menu;
                }

                if($scope.selectedTopMenu.children && $scope.selectedTopMenu.children.length > 0){
                    angular.forEach($scope.selectedTopMenu.children, function(menu, index){
                        if(menu.module==0){
                            $scope.discussMenuCnt++;
                        }
                    })
                }

                $scope.updateSectionHeader(menu);
                $(".selected-dropdown").removeClass("selected-dropdown");
                $("#" + menu.id).parents(".by-menu").addClass("selected-dropdown");

                if($scope.selectedTopMenu && $scope.selectedTopMenu.children && $scope.selectedTopMenu.children.length == 0){
                    $(".by_left_panel_fixed").addClass("by_left_panel_homeSlider_position");
                    $(".by_left_panel_fixed").addClass('by_left_panel_homeSlider');
                    //$(".by_left_panel_fixed").css('margin-top', '0px');
                }else{
                    $(".by_left_panel_fixed").removeClass('by_left_panel_homeSlider');
                }
            }else{
                $(".selected-dropdown").removeClass("selected-dropdown");
                $scope.selectedTopMenu = null;
            }
        });

        $scope.subMenuResize = function(height, width){
            var leftMenuHeight = $(".by-left-menu").height(),
                sliderHeight = $(".by_section_header").height();

            if (leftMenuHeight > 0) {
                var marginTop = leftMenuHeight - sliderHeight;
                $(".by_left_panel_fixed").css('margin-top', marginTop + 'px');
            }
            $(".by-leafMenu").css('min-height', leftMenuHeight - 21);
        }

        angular.element($window).bind("scroll", function() {
            if($scope.selectedTopMenu && $scope.selectedTopMenu.children && $scope.selectedTopMenu.children.length == 0){
                console.log("comes inside");
                if($(".homeSlider").length > 0){
                    $scope.sliderHeight = $(".homeSlider").height();
                }else{
                    $scope.sliderHeight = $(".by_section_header").height();
                }
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
        });

    }]);