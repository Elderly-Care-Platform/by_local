byControllers.controller('ServiceSearchController', ['$scope', '$rootScope', '$location', '$route', '$routeParams',
                                                     'ServicePageSearch', '$sce', '$window',
     function ($scope, $rootScope, $location, $route, $routeParams, FindServices, $sce, $window) {

         var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);

         $scope.findViews = {};
         $scope.findViews.contentPanel = "app/components/find/servicesContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";

         $scope.showSpecialityFilter = false;
         $scope.selectedMenu = $rootScope.menuCategoryMap[$routeParams.menuId];

         var city = $routeParams.city;
         var tags = [];
         var queryParams = {p:0,s:10};
         queryParams.term = $routeParams.term;
         
         $scope.profileImage = function (service) {
            service.profileImage = BY.config.profile.userType[service.userTypes[0]].profileImage;
         }

         $scope.getData = function (queryParams) {
             $("#preloader").show();
             $scope.services = FindServices.get(queryParams, function (services) {
                     $scope.services = services.data.content;
                     $scope.pageInfo = BY.byUtil.getPageInfo(services.data);
                     $scope.pageInfo.isQueryInProgress = false;
                     $("#preloader").hide();
                     function regexCallback(p1, p2,p3,p4) {
               		    return ((p2==undefined)||p2=='')?p1:'<i class="highlighted-text" >'+p1+'</i>';
               		}
                      setTimeout(
               				function(){
               						$(".service-card").each(function(a,b){
               							var myRegExp = new RegExp("<[^>]+>|("+$routeParams.term+")","ig");
               						var result = $(b).html().replace(myRegExp,regexCallback);
               						$(b).html(result);
               						}
               				)},500);
                 },
                 function (error) {
                     console.log(error);
                 });
         }

         $scope.showFilters = function () {
             if ($scope.selectedMenu && $scope.selectedMenu.filterName && $scope.selectedMenu.filterName!==null && $scope.selectedMenu.children.length > 0) {
                 $scope.showSpecialityFilter = true;
                 $scope.specialities = $.map($scope.selectedMenu.children, function (value, key) {
                     return {label:value.displayMenuName, value:value.displayMenuName, obj:value};
                 });
             }
         }

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
             tags = speciality.obj.tags[0].id;
             queryParams.tags = tags.toString();
             $scope.getData(queryParams);
         }


         $scope.loadMore = function ($event) {
             if ($scope.pageInfo && !$scope.pageInfo.lastPage && !$scope.pageInfo.isQueryInProgress) {
                 $scope.pageInfo.isQueryInProgress = true;
                 queryParams.p = $scope.pageInfo.number + 1;
                 queryParams.s = $scope.pageInfo.size;

                 FindServices.get(queryParams, function (services) {
                         if (services.data.content.length > 0) {
                             $scope.pageInfo.isQueryInProgress = false;
                             $scope.services = $scope.services.concat(services.data.content);
                         }
                         $scope.pageInfo = BY.byUtil.getPageInfo(services.data);
                         $scope.pageInfo.isQueryInProgress = false;
                         $("#preloader").hide();
                         function regexCallback(p1, p2,p3,p4) {
                  		    return ((p2==undefined)||p2=='')?p1:'<i class="highlighted-text" >'+p1+'</i>';
                  		}
                         setTimeout(
                  				function(){
                  						$(".service-card").each(function(a,b){
                  							var myRegExp = new RegExp("<[^>]+>|("+$routeParams.term+")","ig");
                  						var result = $(b).html().replace(myRegExp,regexCallback);
                  						$(b).html(result);
                  						}
                  				)},500);
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


 	}]);

