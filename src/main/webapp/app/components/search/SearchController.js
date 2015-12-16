define(['byApp', 'byUtil', 'userTypeConfig', 'discussLikeController', 'shareController'],
    function(byApp, byUtil, userTypeConfig, discussLikeController, shareController) {
        function SearchController($scope, $rootScope, $http, $route, $location, $routeParams, DiscussSearch, ServiceSearch, HousingSearch, $sce, SERVERURL_IMAGE, Utility){
            $rootScope.term = $routeParams.term;

            //If this is enabled, then we need to somehow inject topic and subtopic information into the Discuss being created by users
            //For now Discuss cannot be created from the search page.
            $scope.showme = false;

            var disType = $routeParams.searchType;

            $scope.discuss = "";
            $scope.pageInfo = {};
            $scope.pageInfo.lastPage = true;
            $scope.pageSize = 10;
            $scope.serverurl = SERVERURL_IMAGE.hostUrl;

            $scope.getDiscussData = function(page, size){
                (function(){
                    var metaTagParams = {
                        title:  $rootScope.term,
                        imageUrl:   "",
                        description:   "Search in beautifulYears.com",
                        keywords:[$rootScope.term]
                    }
                    BY.byUtil.updateMetaTags(metaTagParams);
                })();
                DiscussSearch.get({'term': $rootScope.term, 'p': page, 's': size}, function (value) {
                    $scope.discuss = value.data.content;
                    $scope.discussPagination = {};
                    $scope.discussPagination.totalPosts = value.data.total;
                    $scope.discussPagination.noOfPages = Math.ceil(value.data.total / value.data.size);
                    $scope.discussPagination.currentPage = value.data.number;
                    $scope.discussPagination.pageSize = $scope.pageSize;

                    $scope.discussTotal = value.data.total;
                    function regexCallback(p1, p2, p3, p4) {
                        return ((p2 == undefined) || p2 == '') ? p1 : '<i class="highlighted-text" >' + p1 + '</i>';
                    }
                    $scope.scrollTo("search-post");
                    setTimeout(
                        function () {
                            $(".by-discuss-card").each(function (a, b) {
                                    var myRegExp = new RegExp("<[^>]+>|(" + $rootScope.term + ")", "ig");
                                    var result = $(b).html().replace(myRegExp, regexCallback);
                                    $(b).html(result);
                                }
                            )
                        }, 500);


                }, function (error) {
                    console.log(error);
                });
            };

            $scope.getServicesData = function(page, size){
                ServiceSearch.get({term: $rootScope.term, 'p': page, 's': size}, function (value) {
                    $scope.services = value.data.content;
                    $scope.servicePagination = {};
                    $scope.servicePagination.totalPosts = value.data.total;
                    $scope.servicePagination.noOfPages = Math.ceil(value.data.total / value.data.size);
                    $scope.servicePagination.currentPage = value.data.number;
                    $scope.servicePagination.pageSize = $scope.pageSize;

                    $scope.serviceTotal = value.data.total;
                    function regexCallback(p1, p2, p3, p4) {
                        return ((p2 == undefined) || p2 == '') ? p1 : '<i class="highlighted-text" >' + p1 + '</i>';
                    }
                    $scope.scrollTo("search-search");
                    setTimeout(
                        function () {
                            $(".service-card").each(function (a, b) {
                                    var myRegExp = new RegExp("<[^>]+>|(" + $rootScope.term + ")", "ig");
                                    var result = $(b).html().replace(myRegExp, regexCallback);
                                    $(b).html(result);
                                }
                            )
                        }, 500);
                });
            };


            $scope.getHousingData = function(page, size){
                HousingSearch.get({term: $rootScope.term, 'p': page, 's': size}, function (value) {
                    $scope.housing = value.data.content;
                    $scope.housingPagination = {};
                    $scope.housingPagination.totalPosts = value.data.total;
                    $scope.housingPagination.noOfPages = Math.ceil(value.data.total / value.data.size);
                    $scope.housingPagination.currentPage = value.data.number;
                    $scope.housingPagination.pageSize = $scope.pageSize;



                    $scope.housingTotal = value.data.total;
                    function regexCallback(p1, p2, p3, p4) {
                        return ((p2 == undefined) || p2 == '') ? p1 : '<i class="highlighted-text" >' + p1 + '</i>';
                    }
                    $scope.scrollTo("search-housing");
                    setTimeout(
                        function () {
                            $(".housing-card").each(function (a, b) {
                                    var myRegExp = new RegExp("<[^>]+>|(" + $rootScope.term + ")", "ig");
                                    var result = $(b).html().replace(myRegExp, regexCallback);
                                    $(b).html(result);
                                }
                            )
                        }, 500);
                });
            };

            $scope.getProductsData = function(page, size){
                page = page + 1;
                $http({method:'GET', url: BY.config.constants.productHost + '/catalog/search/products', params:{q: $rootScope.term, 'page': page, 'pageSize': size}}).then(function(response) {
                    console.log(response);
                    $scope.products = response.data;
                    $scope.productPagination = {};
                    $scope.productPagination.totalPosts = response.data.totalResults;
                    $scope.productPagination.noOfPages = Math.ceil(response.data.totalResults / response.data.pageSize);
                    $scope.productPagination.currentPage = response.data.page;
                    $scope.productPagination.pageSize = $scope.pageSize;
                    if($scope.products.products)
                        Utility.checkImages($scope.products.products);

                    $scope.productsTotal = response.data.totalResults;
                    function regexCallback(p1, p2, p3, p4) {
                        return ((p2 == undefined) || p2 == '') ? p1 : '<i class="highlighted-text" >' + p1 + '</i>';
                    }
                    $scope.scrollTo("search-product");
                    setTimeout(
                        function () {
                            $(".by_productCard").each(function (a, b) {
                                    var myRegExp = new RegExp("<[^>]+>|(" + $rootScope.term + ")", "ig");
                                    var result = $(b).html().replace(myRegExp, regexCallback);
                                    $(b).html(result);
                                }
                            )
                        }, 500);
                });
            };

             $scope.leftPanelHeight = function(){            
            var clientHeight = $( window ).height() - 57;
            $(".by_menuDetailed").css('height', clientHeight+"px");
        }

        $scope.subMenuTabMobileShow = function () {
            $(".by_mobile_leftPanel_image").click(function () {
                if ($(".by_mobile_leftPanel_hide").css('left') == '0px') {
                    $(".by_mobile_leftPanel_image").animate({left: "0%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburgerG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "-90%"}, {duration: 400});
                } else {
                    $(".by_mobile_leftPanel_image").animate({left: "90%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger-minG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "0%"}, {duration: 400});
                }
            });
        };



            var initSearch = function(){
                if (disType == 'All') {
                    $scope.getDiscussData(0, $scope.pageSize);
                    $scope.getServicesData(0, $scope.pageSize);
                    $scope.getHousingData(0, $scope.pageSize);
                    $scope.getProductsData(0, $scope.pageSize);
                }
            };
            initSearch();
            $scope.profileImage = function (service) {
                service.profileImage = BY.config.profile.userType[service.userTypes[0]].profileImage;
            }

            $scope.trustForcefully = function(html) {
                return $sce.trustAsHtml(html);
            };

            $scope.trustAsResourceUrl = function(url) {
                return $sce.trustAsResourceUrl(url);
            };

            $scope.tooltipText = function(){
                $('[data-toggle="tooltip"]').tooltip();
            }

            $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;
            
            $scope.go = function($event, type, id, discussType){
                $event.stopPropagation();
                if(type === "detail"){
                    $location.path('/discuss/'+id);
                } else if(type === "menu" && $rootScope.menuCategoryMap){
                    var menu = $rootScope.menuCategoryMap[id];
                    //$(".selected-dropdown").removeClass("selected-dropdown");
                    //$("#" + menu.id).parents(".dropdown").addClass("selected-dropdown");
                    if(menu.module===0){
                        $location.path("/communities/"+$scope.removeSpecialChars(menu.displayMenuName)+"/"+menu.id+"/all");
                    }else if(menu.module===1){
                        $location.path("/services/list/"+menu.displayMenuName+"/"+menu.id+"/all/");
                    }else{
                        //nothing as of now
                    }
                }else if(type === "accordian"){
                    $($event.target).find('a').click();
                }else if(type === "comment") {
                    $location.path('/discuss/' + id).search({comment: true});
                }
            }


            $scope.location = function ($event, userId, userType) {
                $event.stopPropagation();
                if (userId && userType.length > 0) {
                    $location.path('/profile/' + userType[0] + '/' + userId);
                }
            };

            $scope.housingLocation = function ($event, userID, id) {
                $event.stopPropagation();
                if(id) {
                    $location.path('/housingProfile/3/'+userID+'/'+id);
                }
            }

            $scope.openProductDescription = function($event, productId, productName) {
                $event.stopPropagation();
                if(productId) {
                    var prodName = productName.replace(/[^a-zA-Z0-9 ]/g, ""),
                        prodName = prodName.replace(/\s+/g, '-').toLowerCase(),
                        path = '/' + prodName + '/pd/' + productId;

                    $location.path(path);
                }
            }


            $scope.term = $rootScope.term;

            $scope.showMore = function (discussType) {
                $location.path("/search/" + $rootScope.term + "/" + disType + "/" + discussType);
            };

            $scope.setSelectedTab = function (param) {
                if($rootScope.windowWidth < 720){
                    $(".by_mobile_leftPanel_image").animate({left: "0%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburgerG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "-90%"}, {duration: 400});
                } 
                if(param === 'd' && $scope.discussTotal > 0){
                    $scope.selectedTab = param;
                } else if(param === 'd' && $scope.serviceTotal > 0){
                    $scope.selectedTab = 's';
                } else if(param === 'd' && $scope.housingTotal > 0){
                    $scope.selectedTab = 'h';
                }  else if(param === 'd' && $scope.productsTotal > 0){
                    $scope.selectedTab = 'p';
                }else{
                    $scope.selectedTab = param;
                }

            };

            $scope.scrollTo = function (id) {
                if (id) {
                    var tag = $("#" + id + ":visible");
                    if (tag.length > 0) {
                        $('html,body').animate({scrollTop: tag.offset().top - 57}, '0');
                    }
                }
            };
        }

        SearchController.$inject = ['$scope', '$rootScope', '$http', '$route', '$location', '$routeParams', 'DiscussSearch',
            'ServicePageSearch', 'HousingPageSearch',  '$sce', 'SERVERURL_IMAGE', 'Utility'];
        byApp.registerController('SearchController', SearchController);
        return SearchController;
    });