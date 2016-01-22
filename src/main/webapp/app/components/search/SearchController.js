define(['byApp', 'byUtil', 'userTypeConfig', 'discussLikeController', 'shareController'],
    function(byApp, byUtil, userTypeConfig, discussLikeController, shareController) {
        function SearchController($scope, $rootScope, $http, $route, $location, $routeParams, DiscussSearch, ServiceSearch, HousingSearch, $sce, SERVERURL_IMAGE, Utility, $q, UserValidationFilter){
            $rootScope.term = $routeParams.term;
            $scope.userTypeConfig           = BY.config.profile.userTypeMap;

            //If this is enabled, then we need to somehow inject topic and subtopic information into the Discuss being created by users
            //For now Discuss cannot be created from the search page.
            $scope.showme = false;

            var disType = $routeParams.searchType;

            $scope.userCredential = {'email': '', 'pwd': ''};

            $scope.discuss = "";
            $scope.pageInfo = {};
            $scope.pageInfo.lastPage = true;
            $scope.pageSize = 10;
            $scope.serverurl = SERVERURL_IMAGE.hostUrl;
            
            $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;

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
                    $("#preloader").hide();
                }, function (error) {        
                    $("#preloader").hide();       
                    console.log(error);
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
                $("#preloader").show();
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
            
            $scope.go = function($event, discuss, queryParams){
                $event.stopPropagation();
                var url = getDiscussDetailUrl(discuss, queryParams, true);
                $location.path(url);
            };

            $scope.openModal = function ($event, data) {
                $event.stopPropagation();
                $scope.shareDiscussObject = data;
                $('#shareModal').modal('show');
            }
            
            $scope.getHref = function(discuss, queryParams){
            	var newHref = getDiscussDetailUrl(discuss, queryParams, false);
                newHref = "#!" + newHref;
                return newHref;
            };

            function getDiscussDetailUrl(discuss, queryParams, isAngularLocation){
                var disTitle = "others";
                if(discuss.title && discuss.title.trim().length > 0){
                    disTitle = discuss.title;
                } else if(discuss.text && discuss.text.trim().length > 0){
                    disTitle = discuss.text;
                } else if(discuss.linkInfo && discuss.linkInfo.title && discuss.linkInfo.title.trim().length > 0){
                    disTitle = discuss.linkInfo.title;
                } else{
                    disTitle = "others";
                }

                disTitle = BY.byUtil.getSlug(disTitle);
                var newHref = "/communities/"+disTitle;


                if(queryParams && Object.keys(queryParams).length > 0){
                    //Set query params through angular location search method
                    if(isAngularLocation){
                        angular.forEach($location.search(), function (value, key) {
                            $location.search(key, null);
                        });
                        angular.forEach(queryParams, function (value, key) {
                            $location.search(key, value);
                        });
                    } else{ //Set query params manually
                        newHref = newHref + "?"
                        angular.forEach(queryParams, function (value, key) {
                            newHref = newHref + key + "=" + value + "&";
                        });

                        //remove the last  '&' symbol from the url, otherwise browser back does not work
                        newHref = newHref.substr(0, newHref.length - 1);
                    }
                }

                return newHref;
            };


        $scope.location = function($event, profile, urlQueryParams){
            $event.stopPropagation();
            var url = getProfileDetailUrlS(profile, urlQueryParams, true);
            $location.path(url);
        };
        
        $scope.getHrefProfile = function(profile, urlQueryParams){
            var newHref = getProfileDetailUrlS(profile, urlQueryParams, false);
            newHref = "#!" + newHref;
            return newHref;
        };
        
        function getProfileDetailUrlS(profile, urlQueryParams, isAngularLocation){
            var proTitle = "others";
            if(profile.basicProfileInfo){
                if(profile && profile.basicProfileInfo.firstName && profile.basicProfileInfo.firstName.length > 0){
                   proTitle = profile.basicProfileInfo.firstName;
                   if(profile.individualInfo.lastName  && profile.individualInfo.lastName != null && profile.individualInfo.lastName.length > 0){
                       proTitle = proTitle + " " + profile.individualInfo.lastName;
                   }
               }else{
                   proTitle = "others";
               }
            } 
            if(profile.name){
                if(profile && profile.name && profile.name.length > 0){
                   proTitle = profile.name;
               }else{
                   proTitle = "others";
               }
            }

            proTitle = BY.byUtil.getSlug(proTitle);
            var newHref = "/users/"+proTitle;


            if(urlQueryParams && Object.keys(urlQueryParams).length > 0){
                //Set query params through angular location search method
                if(isAngularLocation){
                    angular.forEach($location.search(), function (value, key) {
                        $location.search(key, null);
                    });
                    angular.forEach(urlQueryParams, function (value, key) {
                        $location.search(key, value);
                    });
                } else{ //Set query params manually
                    newHref = newHref + "?"

                    angular.forEach(urlQueryParams, function (value, key) {
                        newHref = newHref + key + "=" + value + "&";
                    });

                    //remove the last  '&' symbol from the url, otherwise browser back does not work
                    newHref = newHref.substr(0, newHref.length - 1);
                }
            }

            return newHref;
        };

            $scope.openProductDescription = function($event, productId, productName) {
                $event.stopPropagation();
                if(productId) {
                    var prodName = productName.replace(/[^a-zA-Z0-9 ]/g, ""),
                        prodName = prodName.replace(/\s+/g, '-').toLowerCase(),
                        path = '/' + prodName + '/pd/' + productId;

                    $location.path(path);
                }
            }

            $scope.productUrl = function(productId, productName){
                if(productId) {
                    var prodName = productName.replace(/[^a-zA-Z0-9 ]/g, ""),
                    prodName = prodName.replace(/\s+/g, '-').toLowerCase(),
                    newHref = '#!/' + prodName + '/pd/' + productId;
                    return  newHref;
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

            //Discuss like code
            $scope.getUserCredentialForLike = function(discussLikeObj){
                if($scope.discussLikeObj){
                    delete $scope.discussLikeObj.pendingUserCredential
                }
                $scope.discussLikeObj = discussLikeObj;
                $scope.discussLikeObj.pendingUserCredential = true;
                $scope.userCredential.defer= $q.defer();

                return $scope.userCredential.defer.promise;
            }

            $scope.setUserCredentialForLike = function(){
                if($scope.userCredential.email && BY.byUtil.validateEmailId($scope.userCredential.email)){
                    var promise = UserValidationFilter.loginUser($scope.userCredential.email);
                    promise.then(validUser, invalidUser);
                }else{
                    $scope.likeErrMsg = "Please enter valid email";
                }

                function validUser(){
                    if($scope.userCredential.defer){
                        $scope.discussLikeObj.pendingUserCredential = false;
                        $scope.userCredential.defer.resolve();
                        //delete $scope.userCredential.promise;
                    }
                }

                function invalidUser(errMsg){
                    console.log("invalid user error");
                    $scope.likeErrMsg = errMsg;
                    if($scope.userCredential.defer){
                        $scope.userCredential.defer.reject();
                    }
                    //delete $scope.userCredential.promise;
                }
            }

            $scope.cancelSetCredentialForLike = function(){
                $scope.discussLikeObj.pendingUserCredential = false;
                if($scope.userCredential.defer){
                    $scope.userCredential.defer.reject();
                }
            }
        }

        SearchController.$inject = ['$scope', '$rootScope', '$http', '$route', '$location', '$routeParams', 'DiscussSearch',
            'ServicePageSearch', 'HousingPageSearch',  '$sce', 'SERVERURL_IMAGE', 'Utility', '$q', 'UserValidationFilter'];
        byApp.registerController('SearchController', SearchController);
        return SearchController;
    });