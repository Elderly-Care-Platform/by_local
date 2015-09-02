byControllers.controller('SearchController', ['$scope', '$rootScope', '$route', '$location', '$routeParams', 'DiscussSearchForDiscussType', 'DiscussSearch', 'ServicePageSearch',
    function ($scope, $rootScope, $route, $location, $routeParams, DiscussSearchForDiscussType, DiscussSearch, ServiceSearch) {
        $rootScope.term = $routeParams.term;

        //If this is enabled, then we need to somehow inject topic and subtopic information into the Discuss being created by users
        //For now Discuss cannot be created from the search page.
        $scope.showme = false;

        var disType = $routeParams.disType;

        $scope.discuss = "";
        $scope.pageInfo = {};
        $scope.pageInfo.lastPage = true;
        $scope.isShowServices = true;
        $scope.pageSize = 10;

        $scope.getDiscussData = function(page, size){
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
                        $(".blog-author").each(function (a, b) {
                                var myRegExp = new RegExp("<[^>]+>|(" + $rootScope.term + ")", "ig");
                                var result = $(b).html().replace(myRegExp, regexCallback);
                                $(b).html(result);
                            }
                        )
                    }, 500);
            }, function (e) {
                alert(e);
            });
        };

        $scope.getServicesData = function(page, size){
            ServiceSearch.get({term: $rootScope.term, 'p': page, 's': size}, function (value) {
                $scope.services = value.data.content;
                $scope.serviceTotal = value.data.total;
                function regexCallback(p1, p2, p3, p4) {
                    return ((p2 == undefined) || p2 == '') ? p1 : '<i class="highlighted-text" >' + p1 + '</i>';
                }

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


        var initSearch = function(){
            if (disType == 'All') {
                $scope.getDiscussData(0, $scope.pageSize);
                $scope.getServicesData(0, $scope.pageSize);
            }
        };
        initSearch();
        $scope.profileImage = function (service) {
            service.profileImage = BY.config.profile.userType[service.userTypes[0]].profileImage;
        }



        $scope.go = function ($event, type, id, discussType) {
            $event.stopPropagation();
            if (type === "detail") {
                $location.path('/discuss/' + id);
            } else if (type === "menu" && $rootScope.menuCategoryMap) {
                var menu = $rootScope.menuCategoryMap[id];
                //$(".selected-dropdown").removeClass("selected-dropdown");
                //$("#" + menu.id).parents(".dropdown").addClass("selected-dropdown");
                if (menu.module === 0) {
                    $location.path("/discuss/list/" + menu.displayMenuName + "/" + menu.id + "/all");
                } else if (menu.module === 1) {
                    $location.path("/services/list/" + menu.displayMenuName + "/" + menu.id + "/all/");
                } else {
                    //nothing as of now
                }
            } else if (type === "accordian") {
                $($event.target).find('a').click();
            } else if (type === "comment") {
                $location.path('/discuss/' + id).search({comment: true});
            }
        }


        $scope.location = function ($event, userId, userType) {
            $event.stopPropagation();
            if (userId && userType.length > 0) {
                $location.path('/profile/' + userType[0] + '/' + userId);
            }
        };

        $scope.term = $rootScope.term;


        $rootScope.bc_topic = 'list';
        $rootScope.bc_subTopic = 'all';
        $rootScope.bc_discussType = disType;

        $scope.showMore = function (discussType) {
            $location.path("/search/" + $rootScope.term + "/" + disType + "/" + discussType);
        };

        $scope.showServices = function (param) {
            $scope.isShowServices = param;
        };

        $scope.scrollTo = function (id) {
            if (id) {
                var tag = $("#" + id + ":visible");
                if (tag.length > 0) {
                    $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, '0');
                }
            }
        };

    }]);



