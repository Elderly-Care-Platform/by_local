//DIscuss All
byControllers.controller('ServicesController', ['$scope', '$rootScope', '$location', '$route', '$routeParams',
    'FindServices', '$sce', '$window',
    function ($scope, $rootScope, $location, $route, $routeParams, FindServices, $sce, $window) {

        var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);

        $scope.findViews = {};
        $scope.findViews.leftPanel = "app/components/find/servicesLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.findViews.contentPanel = "app/components/find/servicesContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";

        $scope.showSpecialityFilter = false;
        $scope.selectedMenu = $rootScope.menuCategoryMap[$routeParams.menuId];

        var city = $routeParams.city;
        var tags = [];
        var queryParams = {p:0,s:10};
        
        
        
        $scope.profileImage = function (service) {
           service.profileImage = BY.config.profile.userType[service.userTypes[0]].profileImage;
        }
        
        $scope.updateSectionHeader = function(){
        	var menuName = $scope.selectedMenu.displayMenuName.toLowerCase().trim();
        	$scope.sectionHeader = BY.config.sectionHeader[menuName];
        	if(!$scope.sectionHeader && $scope.selectedMenu.ancestorIds.length > 0) {
        		if($scope.selectedMenu.ancestorIds.length===1){
        			var rootMenu = $rootScope.menuCategoryMap[$scope.selectedMenu.ancestorIds[0]];
            		$scope.sectionHeader = BY.config.sectionHeader[rootMenu.displayMenuName.toLowerCase().trim()];
        		} else if ($scope.selectedMenu.ancestorIds.length===2){
        			var rootMenu = $rootScope.menuCategoryMap[$scope.selectedMenu.ancestorIds[1]];
            		$scope.sectionHeader = BY.config.sectionHeader[rootMenu.displayMenuName.toLowerCase().trim()];
        		}
        		
        		if($scope.sectionHeader[menuName]){
        			$scope.sectionHeader = $scope.sectionHeader[menuName];
        		}
        	} 
        	//console.log($scope.sectionHeader);
        };

        if($scope.selectedMenu){
            $(".selected-dropdown").removeClass("selected-dropdown");
            $("#" + $scope.selectedMenu.id).parents(".by-menu").addClass("selected-dropdown");

            tags = $.map($scope.selectedMenu.tags, function(value, key){
                return value.id;
            })
            queryParams.tags = tags.toString();  //to create comma separated tags list
        }

        if (city && city !== "" && city !== "all") {
            queryParams.city = city;
        }

        //var serviceCategory = $routeParams.services;
        //var queryParams = {page: 0, size: 10};
        //
        //if (serviceCategory && serviceCategory !== "" && serviceCategory !== "all") {
        //    queryParams.services = serviceCategory;
        //}
        //
        //if (city && city !== "" && city !== "all") {
        //    queryParams.city = city;
        //}

        $scope.getData = function (queryParams) {
            $("#preloader").show();
            $scope.services = FindServices.get(queryParams, function (services) {
                    $scope.services = services.data.content;
                    $scope.pageInfo = BY.byUtil.getPageInfo(services.data);
                    $scope.pageInfo.isQueryInProgress = false;
                    $("#preloader").hide();
                },
                function (error) {
                    console.log(error);
                });

            $scope.updateSectionHeader();
        }


        //$scope.showBreadcrums = function () {
        //    $rootScope.bc_topic = 'list';
        //    $rootScope.bc_subTopic = 'all';
        //    $rootScope.bc_discussType = 'all';
        //
        //    $rootScope.bc_topicId = 'all';
        //    $rootScope.bc_subTopicId = 'all';
        //
        //    var category = $rootScope.findCategoryListMap ? $rootScope.findCategoryListMap[queryParams.services] : null;
        //    if (category) {
        //        $rootScope.bc_topic = category.name;
        //        $rootScope.bc_subTopic = 'all';
        //
        //        $rootScope.bc_topicId = category.id;
        //        $rootScope.bc_subTopicId = 'all';
        //
        //        if (category.parentId) {
        //            $rootScope.bc_subTopic = category.name;
        //            $rootScope.bc_topic = $rootScope.findCategoryListMap[category.parentId].name;
        //
        //            $rootScope.bc_topicId = category.parentId;
        //            $rootScope.bc_subTopicId = category.id;
        //        }
        //    }
        //}

        $scope.showFilters = function () {
            if ($scope.selectedMenu && $scope.selectedMenu.filterName && $scope.selectedMenu.filterName!==null && $scope.selectedMenu.children.length > 0) {
                $scope.showSpecialityFilter = true;
                $scope.specialities = $.map($scope.selectedMenu.children, function (value, key) {
                    return {label:value.displayMenuName, value:value.displayMenuName, obj:value};
                });
            }
        }

        //$scope.showBreadcrums();
        $scope.showFilters();
        $scope.getData(queryParams);

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        }


        $scope.location = function ($event, userId, userType) {
            $event.stopPropagation();
            if (userId && userType.length > 0) {
                $location.path('/profile/' + userType[0] + '/' + userId);
            }
        }

        $scope.add = function (type) {
            $scope.error = "";
            $scope.findViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            window.scrollTo(0, 0);
        };

        $scope.postSuccess = function () {
            $route.reload();
        };

        $scope.cityOptions = {
            types: "(cities)",
            resetOnFocusOut: false
        }

        $scope.addressCallback = function (response) {
            $('#addressCity').blur();
            queryParams.city = response.name;
            $scope.getData(queryParams);
        }

        $scope.specialityCallback  = function (speciality){
            //angular.forEach($scope.specialities, function(data, index){
            //    if(tags.indexOf(data.obj.tags[0].id) > -1){
            //        tags.splice(tags.indexOf(data.obj.tags[0].id), 1);
            //    }
            //});

            tags = speciality.obj.tags[0].id;
            queryParams.tags = tags.toString();
            $scope.getData(queryParams);
        }


        $scope.loadMore = function ($event) {
            if ($scope.pageInfo && !$scope.pageInfo.lastPage && !$scope.pageInfo.isQueryInProgress) {
                $scope.pageInfo.isQueryInProgress = true;
                queryParams.page = $scope.pageInfo.number + 1;
                queryParams.size = $scope.pageInfo.size;

                FindServices.get(queryParams, function (services) {
                        if (services.data.content.length > 0) {
                            $scope.pageInfo.isQueryInProgress = false;
                            $scope.services = $scope.services.concat(services.data.content);
                        }
                        $scope.pageInfo = BY.byUtil.getPageInfo(services.data);
                        $scope.pageInfo.isQueryInProgress = false;
                        $("#preloader").hide();
                    },
                    function (error) {
                        console.log("Services on city not found");
                    });
            }
        }
        
        angular.element($window).bind("scroll", function() {
        	$scope.sliderHeight = $(".by_section_header").height();
        	if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= $scope.sliderHeight){
        		$(".by_left_panel_homeSlider_position").removeClass('by_left_panel_homeSlider');
        		$(".by_left_panel_homeSlider_position").css('margin-top', -$scope.sliderHeight+'px');
        	}else{
        		$(".by_left_panel_homeSlider_position").addClass('by_left_panel_homeSlider');
        		$(".by_left_panel_homeSlider_position").css('margin-top', '0px');
        	}
        });
        
        $scope.resize = function(height, width){
        	if(width > 730){
        		$(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImage +')');
        	} else{
        		$(".by_section_header").css('background-image', 'url('+ $scope.sectionHeader.sectionImageMobile +')');
        	}   	
        };

        $scope.showAllServices = function($event, service){
            var parentNode = $($event.target.parentElement),
                linkNode = parentNode.find(".serviceShowMoreLink"),
                iconNode = parentNode.find(".serviceShowMoreIcon");

            service.showMoreServices = (service.showMoreServices===false)? true : false;
            var linkText = (linkNode.text().trim()==="More") ? "Less" : "More";
            linkNode.text(linkText);

            if(service.showMoreServices){
                iconNode.addClass("fa-angle-up");
                iconNode.removeClass("fa-angle-down");
            }else{
                iconNode.removeClass("fa-angle-up");
                iconNode.addClass("fa-angle-down");
            }
            $scope.$apply();
        }
    }]);
