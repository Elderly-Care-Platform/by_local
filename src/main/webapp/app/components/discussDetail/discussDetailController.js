define(['byApp', 'byUtil', 'discussLikeController', 'discussDetailLeftController', 'discussReplyController', 'shareController'],
    function (byApp, byUtil, discussLikeController, discussDetailLeftController, discussReplyController, shareController) {
        function DiscussDetailController($scope, $rootScope, $routeParams, $location, DiscussDetail, $sce, broadCastData, $timeout, ErrorService) {
            var discussId = $routeParams.id;	//discuss Id from url
            var isComment = $routeParams.comment;
            $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;
            $scope.getShortTitle = BY.byUtil.getShortTitle;

            $scope.discussDetailViews = {};
            $scope.discussDetailViews.leftPanel = "app/components/discussDetail/discussDetailLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            $scope.discussDetailViews.contentPanel = "app/components/discussDetail/discussDetailContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            $("#preloader").show();


            var scrollToEditor = function () {
                if (isComment) {
                    $timeout(
                        function () {
                            var tag = $("#replyEditor:visible");
                            if (tag.length > 0) {
                                $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, 'slow');
                            }
                        }, 100);
                }

            };

            function updateMetaTags() {
                var seoTitle = $scope.detailResponse.discuss.title,
                    seoDesc = $scope.detailResponse.discuss.text;

                if (!seoTitle || seoTitle.trim().length == 0) {
                    if ($scope.detailResponse.discuss.linkInfo) {
                        seoTitle = $scope.detailResponse.discuss.linkInfo.title;
                    } else if (seoDesc && seoDesc.trim().length > 0) {
                        var tempDesc = $(seoDesc).text().trim(), nextSpaceIndex;
                        nextSpaceIndex = tempDesc.indexOf(" ", 100);
                        seoTitle = tempDesc.substring(0, nextSpaceIndex);
                    }
                }

                if (!seoDesc || seoDesc.trim().length == 0) {
                    if ($scope.detailResponse.discuss.linkInfo) {
                        seoDesc = "<p>" + $scope.detailResponse.discuss.linkInfo.description + "</p>";
                    } else {
                        seoDesc = "<p>" + seoTitle + "</p>";
                    }
                }

                var metaTagParams = {
                    title: seoTitle,
                    imageUrl: BY.byUtil.getImage($scope.detailResponse.discuss),
                    description: seoDesc,
                    keywords: []
                }
                for (var i = 0; i < $scope.detailResponse.discuss.systemTags.length; i++) {
                    metaTagParams.keywords.push($scope.detailResponse.discuss.systemTags[i].name);
                }
                BY.byUtil.updateMetaTags(metaTagParams);
            };

            DiscussDetail.get({discussId: discussId}, function (discussDetail, header) {
                    //broadcast data to left panel, to avoid another query from left panel of detail page
                    $scope.detailResponse = discussDetail.data;
                    $rootScope.$broadcast('discussDetailReceived', discussDetail.data.discuss);
                    //broadCastData.update(discussDetail.data.discuss);
                    $scope.detailResponse.discuss.createdAt = discussDetail.data.discuss.createdAt;
                    $("#preloader").hide();

                    updateMetaTags();

                    scrollToEditor();
                },
                function (error) {
                    $("#preloader").hide();
                    console.log("error");
                    ErrorService.showError(error);
                });


            $scope.trustForcefully = function (html) {
                return $sce.trustAsHtml(html);
            };
            $scope.trustAsResourceUrl = function (url) {
                return $sce.trustAsResourceUrl(url);
            };

            //update data in view after comments/answers are posted from child controller
            $scope.$on('handleBroadcast', function () {
                if (broadCastData.newData.discuss && discussId === broadCastData.newData.discuss.id) {
                    $scope.detailResponse = broadCastData.newData;
                }
            });

            // $scope.updateShareCount = function (count) {
            //     $scope.detailResponse.discuss.shareCount = count;
            // }

            $scope.getHref = function (discuss, queryParams) {
                var newHref = getDiscussDetailUrl(discuss, queryParams, false);
                newHref = "#!" + newHref;
                return newHref;
            };

            function getDiscussDetailUrl(discuss, queryParams, isAngularLocation) {
                var disTitle = "others";
                if (discuss.title && discuss.title.trim().length > 0) {
                    disTitle = discuss.title;
                } else if (discuss.text && discuss.text.trim().length > 0) {
                    disTitle = discuss.text;
                } else if (discuss.linkInfo && discuss.linkInfo.title && discuss.linkInfo.title.trim().length > 0) {
                    disTitle = discuss.linkInfo.title;
                } else {
                    disTitle = "others";
                }

                disTitle = BY.byUtil.getSlug(disTitle);
                var newHref = "/communities/" + disTitle;


                if (queryParams && Object.keys(queryParams).length > 0) {
                    //Set query params through angular location search method
                    if (isAngularLocation) {
                        angular.forEach($location.search(), function (value, key) {
                            $location.search(key, null);
                        });
                        angular.forEach(queryParams, function (value, key) {
                            $location.search(key, value);
                        });
                    } else { //Set query params manually
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

            $scope.getHrefProfile = function (profile, urlQueryParams) {
                var newHref = getProfileDetailUrl(profile, urlQueryParams, false);
                newHref = "#!" + newHref;
                return newHref;
            };

            function getProfileDetailUrl(profile, urlQueryParams, isAngularLocation) {
                var proTitle = "others";
                if (profile && profile.userProfile && profile.userProfile.basicProfileInfo.firstName && profile.userProfile.basicProfileInfo.firstName.length > 0) {
                    proTitle = profile.userProfile.basicProfileInfo.firstName;
                    if (profile.userProfile.individualInfo.lastName && profile.userProfile.individualInfo.lastName != null && profile.userProfile.individualInfo.lastName.length > 0) {
                        proTitle = proTitle + " " + profile.userProfile.individualInfo.lastName;
                    }
                } else if (profile && profile.username && profile.username.length > 0) {
                    proTitle = BY.byUtil.validateUserName(profile.username);
                } else {
                    proTitle = "others";
                }

                proTitle = BY.byUtil.getSlug(proTitle);
                var newHref = "/users/" + proTitle;


                if (urlQueryParams && Object.keys(urlQueryParams).length > 0) {
                    //Set query params through angular location search method
                    if (isAngularLocation) {
                        angular.forEach($location.search(), function (value, key) {
                            $location.search(key, null);
                        });
                        angular.forEach(urlQueryParams, function (value, key) {
                            $location.search(key, value);
                        });
                    } else { //Set query params manually
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

            $scope.getHrefProfileReply = function (profile, urlQueryParams) {
                var newHref = getProfileDetailUrlReply(profile, urlQueryParams, false);
                newHref = "#!" + newHref;
                return newHref;
            };

            function getProfileDetailUrlReply(profile, urlQueryParams, isAngularLocation) {
                var proTitle = "others";
                if (profile && profile.userName && profile.userName.length > 0) {
                    proTitle = BY.byUtil.validateUserName(profile.userName);
                } else {
                    proTitle = "others";
                }

                proTitle = BY.byUtil.getSlug(proTitle);
                var newHref = "/users/" + proTitle;


                if (urlQueryParams && Object.keys(urlQueryParams).length > 0) {
                    //Set query params through angular location search method
                    if (isAngularLocation) {
                        angular.forEach($location.search(), function (value, key) {
                            $location.search(key, null);
                        });
                        angular.forEach(urlQueryParams, function (value, key) {
                            $location.search(key, value);
                        });
                    } else { //Set query params manually
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

            $scope.getLeafCategories = function(article){
                var menuWith3Ancestor = [], menuWith2Ancestor = [], menuWith1Ancestor = [], menuWith0Ancestor = [];
                for(var i=0; i<article.topicId.length; i++){
                    var topicMenu = $rootScope.menuCategoryMap[article.topicId[i]];
                    if(topicMenu && topicMenu.ancestorIds.length === 3){
                        menuWith3Ancestor.push(article.topicId[i]);
                    }

                    if(topicMenu && topicMenu.ancestorIds.length === 2){
                        menuWith2Ancestor.push(article.topicId[i]);
                    }

                    if(topicMenu && topicMenu.ancestorIds.length === 1){
                        menuWith1Ancestor.push(article.topicId[i]);
                    }

                    if(topicMenu && topicMenu.ancestorIds.length === 0){
                        menuWith0Ancestor.push(article.topicId[i]);
                    }
                }

                if(menuWith3Ancestor.length > 0){
                    article.leafCategories = menuWith3Ancestor;
                } else if(menuWith2Ancestor.length > 0){
                    article.leafCategories = menuWith2Ancestor;
                } else if(menuWith1Ancestor.length > 0){
                    article.leafCategories = menuWith1Ancestor;
                } else {
                    article.leafCategories = menuWith0Ancestor;
                }

            }
        }

        DiscussDetailController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussDetail', '$sce', 'broadCastData', '$timeout', 'ErrorService'];
        byApp.registerController('DiscussDetailController', DiscussDetailController);
        return DiscussDetailController;
    });