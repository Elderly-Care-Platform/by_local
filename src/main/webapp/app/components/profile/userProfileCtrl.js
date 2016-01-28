define(['byApp', 'byUtil', 'userTypeConfig', 'reviewRateController'],
    function(byApp, byUtil, userTypeConfig, reviewRateController) {
        function ProfileController($scope, $rootScope, $location, $routeParams, ReviewRateProfile, UserProfile, $sce,
                                   DiscussPage, $q, UserValidationFilter, ErrorService) {
            $scope.profileViews = {};
            $scope.profileType = $routeParams.profileType;
            $scope.profileId = $routeParams.profileId;
            $scope.userName = $routeParams.profileTitle ? BY.byUtil.validateUserName($routeParams.profileTitle) : "Anonymous";
            $scope.housingFacilityId = $routeParams.housingFacilityId ? $routeParams.housingFacilityId : null;
            $scope.branchId = $routeParams.branchId ? $routeParams.branchId : null;

            $scope.isIndividualProfile = false;
            $scope.isAllowedToReview = false;
            $scope.flags = {};
            $scope.flags.isByAdminVerified = false;

            $scope.userCredential = {
                'email': '',
                'pwd': ''
            };

            var pageSize = 10;
            var reviewDetails = new ReviewRateProfile();


            $scope.tooltipText = function() {
                $('[data-toggle="tooltip"]').tooltip();
            }

            var fetchProfileData = function() {
                $("#preloader").show();
                $scope.profileData = UserProfile.get({
                        userId: $scope.profileId
                    }, function(profile) {
                        $scope.profileData = profile.data;

                        if ($scope.profileData.userTypes.length > 0) {
                            $scope.profileType = $scope.profileData.userTypes[0];
                        } else {
                            $scope.profileType = 0;
                        }

                        $scope.reviewContentType = BY.config.profile.userType[$scope.profileType].reviewContentType;
                        $scope.label = BY.config.profile.userType[$scope.profileType].label;

                        if (BY.config.profile.userType[$scope.profileType].leftPanelCtrl) {
                            require([BY.config.profile.userType[$scope.profileType].leftPanelCtrl], function(leftPanelCtrl) {
                                $scope.profileViews.leftPanel = BY.config.profile.userType[$scope.profileType].leftPanel;
                                $scope.$apply();
                            });
                        } else {
                            $scope.profileViews.leftPanel = BY.config.profile.userType[$scope.profileType].leftPanel;
                        }


                        require([BY.config.profile.userType[$scope.profileType].controller], function(profileCtrl) {
                            $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].contentPanel;
                            $scope.$apply();
                        });

                        if (BY.config.profile.userType[$scope.profileType].category === '0') {
                            $scope.isIndividualProfile = true;
                        }

                        if (localStorage.getItem("USER_ID") !== $scope.profileData.userId) {
                            $scope.isAllowedToReview = true;
                        }
                        $("#preloader").hide();
                    },
                    function(error) {
                        ErrorService.showError(error);
                        $("#preloader").hide();
                        console.log("institution profile error");
                    });
            };


            $scope.postsByUser = function(page, size) {
                var params = {
                    p: page,
                    s: size,
                    discussType: "P",
                    userId: $scope.profileId
                };
                DiscussPage.get(params, function(value) {
                    if (value.data.content.length > 0) {
                        require(['discussLikeController', 'shareController'], function(discussLikeCtrl, shareCtrl) {
                            $scope.$apply();
                        });
                        $scope.postsUser = value.data.content;
                        $scope.postsPagination = {};
                        $scope.postsPagination.totalPosts = value.data.total;
                        $scope.postsPagination.noOfPages = Math.ceil(value.data.total / value.data.size);
                        $scope.postsPagination.currentPage = value.data.number;
                        $scope.postsPagination.pageSize = pageSize;
                        $scope.gotoHref("userPosts");

                    }

                }, function(error) {
                    console.log(error);
                });
            };

            $scope.qaByUser = function(page, size) {
                var params = {
                    p: page,
                    s: size,
                    discussType: "Q",
                    userId: $scope.profileId
                };
                DiscussPage.get(params, function(value) {
                    if (value.data.content.length > 0) {
                        require(['discussLikeController', 'shareController'], function(discussLikeCtrl, shareCtrl) {
                            $scope.$apply();
                        });
                        $scope.qaUser = value.data.content;
                        $scope.qaPagination = {};
                        $scope.qaPagination.totalPosts = value.data.total;
                        $scope.qaPagination.noOfPages = Math.ceil(value.data.total / value.data.size);
                        $scope.qaPagination.currentPage = value.data.number;
                        $scope.qaPagination.pageSize = pageSize;
                        $scope.gotoHref("userQA");
                    }

                }, function(error) {
                    console.log(error);
                });
            };

            var fetchUserPostedContent = function() {
                var pageNumber = 0;
                $scope.postsByUser(pageNumber, pageSize);
                $scope.qaByUser(pageNumber, pageSize);
            };

            $scope.initUserProfile = function() {
                // updateMetaTags();
                fetchProfileData();
                fetchUserPostedContent();
            };

            $scope.leftPanelHeight = function() {
                var clientHeight = $(window).height() - 57;
                $(".by_menuDetailed").css('height', clientHeight + "px");
            }

            $scope.gotoHref = function(id) {
                if (id) {
                    if ($rootScope.windowWidth < 720) {
                        $(".by_mobile_leftPanel_image").animate({
                            left: "0%"
                        }, {
                            duration: 400
                        });
                        $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburgerG.png?versionTimeStamp=%PROJECT_VERSION%')");
                        $(".by_mobile_leftPanel_hide").animate({
                            left: "-90%"
                        }, {
                            duration: 400
                        });
                    }
                    var tag = $("#" + id + ":visible");
                    if (tag.length > 0) {
                        $('html,body').animate({
                            scrollTop: tag.offset().top - 57
                        }, 'slow');
                    }
                }
            };

            $scope.trustForcefully = function(html) {
                return $sce.trustAsHtml(html);
            };

            $scope.trustAsResourceUrl = function(url) {
                return $sce.trustAsResourceUrl(url);
            };

            $scope.showAllServices = function($event, service) {
                var parentNode = $($event.target.parentElement),
                    linkNode = parentNode.find(".serviceShowMoreLink"),
                    iconNode = parentNode.find(".serviceShowMoreIcon");

                service.showMoreServices = (service.showMoreServices === false) ? true : false;
                var linkText = (linkNode.text().trim() === "Show all") ? "Show less" : "Show all";
                linkNode.text(linkText);

                if (service.showMoreServices) {
                    iconNode.addClass("fa-angle-up");
                    iconNode.removeClass("fa-angle-down");
                } else {
                    iconNode.removeClass("fa-angle-up");
                    iconNode.addClass("fa-angle-down");
                }
            };

            /*$scope.location = function ($event, url, params) {
             $event.stopPropagation();
             angular.forEach($location.search(), function (value, key) {
             $location.search(key, null);
             });
             if(url){
             if(params && params.length > 0){
             for(var i=0; i < params.length; i++){
             url = url + "/" + params[i];
             }
             }
             $location.path(url);
             }
             }*/


            $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;

            $scope.go = function($event, discuss, queryParams) {
                $event.stopPropagation();
                var url = getDiscussDetailUrl(discuss, queryParams, true);
                $location.path(url);
            };

            $scope.getHref = function(discuss, queryParams) {
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
                        angular.forEach($location.search(), function(value, key) {
                            $location.search(key, null);
                        });
                        angular.forEach(queryParams, function(value, key) {
                            $location.search(key, value);
                        });
                    } else { //Set query params manually
                        newHref = newHref + "?"
                        angular.forEach(queryParams, function(value, key) {
                            newHref = newHref + key + "=" + value + "&";
                        });

                        //remove the last  '&' symbol from the url, otherwise browser back does not work
                        newHref = newHref.substr(0, newHref.length - 1);
                    }
                }

                return newHref;
            };

            $scope.setHrefCorp = function(profile, queryParams) {
                var newHref = getProfileDetailUrlCorp(profile, queryParams, false);
                newHref = "#!" + newHref;
                return newHref;
            };

            function getProfileDetailUrlCorp(profile, urlQueryParams, isAngularLocation) {
                var proTitle = "others";
                if (profile && profile.basicProfileInfo.firstName && profile.basicProfileInfo.firstName.length > 0) {
                    proTitle = profile.basicProfileInfo.firstName;
                    if (profile.individualInfo.lastName && profile.individualInfo.lastName != null && profile.individualInfo.lastName.length > 0) {
                        proTitle = proTitle + " " + profile.individualInfo.lastName;
                    }
                } else {
                    proTitle = "others";
                }

                proTitle = BY.byUtil.getSlug(proTitle);
                var newHref = "/users/" + proTitle;


                if (urlQueryParams && Object.keys(urlQueryParams).length > 0) {
                    //Set query params through angular location search method
                    if (isAngularLocation) {
                        angular.forEach($location.search(), function(value, key) {
                            $location.search(key, null);
                        });
                        angular.forEach(urlQueryParams, function(value, key) {
                            $location.search(key, value);
                        });
                    } else { //Set query params manually
                        newHref = newHref + "?"

                        angular.forEach(urlQueryParams, function(value, key) {
                            newHref = newHref + key + "=" + value + "&";
                        });

                        //remove the last  '&' symbol from the url, otherwise browser back does not work
                        newHref = newHref.substr(0, newHref.length - 1);
                    }
                }

                return newHref;
            };

            $scope.getHrefProfile = function(profile, urlQueryParams) {
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
                        angular.forEach($location.search(), function(value, key) {
                            $location.search(key, null);
                        });
                        angular.forEach(urlQueryParams, function(value, key) {
                            $location.search(key, value);
                        });
                    } else { //Set query params manually
                        newHref = newHref + "?"

                        angular.forEach(urlQueryParams, function(value, key) {
                            newHref = newHref + key + "=" + value + "&";
                        });

                        //remove the last  '&' symbol from the url, otherwise browser back does not work
                        newHref = newHref.substr(0, newHref.length - 1);
                    }
                }

                return newHref;
            };

            $scope.getHrefProfileReview = function(profile, urlQueryParams) {
                var newHref = getProfileDetailUrlReview(profile, urlQueryParams, false);
                newHref = "#!" + newHref;
                return newHref;
            };

            function getProfileDetailUrlReview(profile, urlQueryParams, isAngularLocation) {
                var proTitle = "others";
                if (profile && profile.userName && profile.userName.length > 0) {
                    proTitle = BY.byUtil.validateUserName(profile.username);
                } else {
                    proTitle = "others";
                }

                proTitle = BY.byUtil.getSlug(proTitle);
                var newHref = "/users/" + proTitle;


                if (urlQueryParams && Object.keys(urlQueryParams).length > 0) {
                    //Set query params through angular location search method
                    if (isAngularLocation) {
                        angular.forEach($location.search(), function(value, key) {
                            $location.search(key, null);
                        });
                        angular.forEach(urlQueryParams, function(value, key) {
                            $location.search(key, value);
                        });
                    } else { //Set query params manually
                        newHref = newHref + "?"

                        angular.forEach(urlQueryParams, function(value, key) {
                            newHref = newHref + key + "=" + value + "&";
                        });

                        //remove the last  '&' symbol from the url, otherwise browser back does not work
                        newHref = newHref.substr(0, newHref.length - 1);
                    }
                }

                return newHref;
            };

            $scope.subMenuTabMobileShow = function() {
                $(".by_mobile_leftPanel_image").click(function() {
                    if ($(".by_mobile_leftPanel_hide").css('left') == '0px') {
                        $(".by_mobile_leftPanel_image").animate({
                            left: "0%"
                        }, {
                            duration: 400
                        });
                        $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburgerG.png?versionTimeStamp=%PROJECT_VERSION%')");
                        $(".by_mobile_leftPanel_hide").animate({
                            left: "-90%"
                        }, {
                            duration: 400
                        });
                    } else {
                        $(".by_mobile_leftPanel_image").animate({
                            left: "90%"
                        }, {
                            duration: 400
                        });
                        $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger-minG.png?versionTimeStamp=%PROJECT_VERSION%')");
                        $(".by_mobile_leftPanel_hide").animate({
                            left: "0%"
                        }, {
                            duration: 400
                        });
                    }
                });
            };

            //Discuss like code
            $scope.getUserCredentialForLike = function(discussLikeObj) {
                if ($scope.discussLikeObj) {
                    delete $scope.discussLikeObj.pendingUserCredential
                }
                $scope.discussLikeObj = discussLikeObj;
                $scope.discussLikeObj.pendingUserCredential = true;
                $scope.userCredential.defer = $q.defer();

                return $scope.userCredential.defer.promise;
            }

            $scope.setUserCredentialForLike = function() {
                if ($scope.userCredential.email && BY.byUtil.validateEmailId($scope.userCredential.email)) {
                    var promise = UserValidationFilter.loginUser($scope.userCredential.email);
                    promise.then(validUser, invalidUser);
                } else {
                    $scope.likeErrMsg = "Please enter valid email";
                }

                function validUser() {
                    if ($scope.userCredential.defer) {
                        $scope.discussLikeObj.pendingUserCredential = false;
                        $scope.userCredential.defer.resolve();
                        //delete $scope.userCredential.promise;
                    }
                }

                function invalidUser(errMsg) {
                    console.log("invalid user error");
                    $scope.likeErrMsg = errMsg;
                    if ($scope.userCredential.defer) {
                        $scope.userCredential.defer.reject();
                    }
                    //delete $scope.userCredential.promise;
                }
            }

            $scope.cancelSetCredentialForLike = function() {
                $scope.discussLikeObj.pendingUserCredential = false;
                if ($scope.userCredential.defer) {
                    $scope.userCredential.defer.reject();
                }
            }

            // share by email and facebook

            $scope.openModal = function($event, data) {
                $event.stopPropagation();
                $scope.shareDiscussObject = data;
                $('#shareModal').modal('show');
            }



        }

        ProfileController.$inject = ['$scope', '$rootScope', '$location', '$routeParams', 'ReviewRateProfile',
            'UserProfile', '$sce', 'DiscussPage', '$q', 'UserValidationFilter', 'ErrorService'];
        byApp.registerController('ProfileController', ProfileController);
        return ProfileController;
    });